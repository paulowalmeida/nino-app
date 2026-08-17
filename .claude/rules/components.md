# Componentes

Vale pra qualquer componente do monorepo — `packages/ds/src/components/*`,
e também `components/`/`compositions/` de cada app (`manager`, `consumer`,
`courier`, `backoffice`). Não é regra exclusiva do design system.

- Um componente por pasta: `Button/Button.tsx`, `Button/Button.module.css`,
  etc. (no `manager`, o type de props fica inline dentro do próprio
  `Button.tsx`, não em `Button.types.ts` separado — ver `code-style.md`)
- Nunca componente como arquivo solto — sempre a pasta, mesmo pra um
  componente pequeno

  ```
  components/
    MyComponent/
      MyComponent.tsx
      MyComponent.module.css
  ```
- **Nunca `index.ts` de barrel dentro da pasta do componente** — regra
  crítica. Import sempre direto do arquivo (`@components/Nome/Nome`, nunca
  `@components/Nome`). Vale tanto pra pasta de componente quanto pra pacote
  do workspace (ver `code-style.md`, "Nunca criar barrel em um pacote do
  workspace") — as duas são a mesma regra em dois níveis.
- **Stories (`ComponentName.stories.tsx`) são exclusivas do design system**
  (`packages/ds/src/components/*`). Componente de app (`manager`, `consumer`,
  `courier`, `backoffice`) NÃO tem stories.

## DS primeiro

Antes de criar qualquer componente de UI (modal, botão, alert, select,
input, switch, tabs etc.), checar se já existe em `@nino/ds/components/*`.
Só criar componente próprio (em `components/` ou `compositions/` do app) se
o DS genuinamente não cobrir o caso — e mesmo assim, compor a partir dos
primitivos do DS em vez de reescrever do zero (ver `ItemPhoto`, que usa
`Button`/`Alert` do DS por dentro).

Exemplo: alternância entre painéis usa sempre `@nino/ds/components/Tabs` —
nunca implementar `<div role="tablist">` + `<button role="tab">` na mão.

**Praticamente zero elemento nativo solto na aplicação** (confirmado em
2026-08-05): `<button>`, `<input>`, `<select>` etc. crus só se justificam
quando o uso é genuinamente único — um caso que não vai se repetir em outra
tela (alça de arrastar com `onPointerDown`, gatilho de menu com conteúdo
composto que não cabe num primitivo). **Qualquer elemento atômico
reutilizável em mais de um lugar é candidato a virar componente do DS, não
componente do app.** O teste é o mesmo de "Quando componentizar" abaixo,
mas aplicado com a régua em `packages/ds/`, não em `components/`/
`compositions/` do app: se o mesmo padrão visual aparece em 2+ lugares
(um chip de categoria e um chip de forma de pagamento, por exemplo), a
resposta não é "cada um implementa o próprio botão estilizado" — é um
componente novo em `@nino/ds/components/*`, com variant cobrindo a
diferença semântica (`role="tab"` vs `aria-pressed`, por exemplo).

**Onde a regra não se aplica**: elemento nativo que só existe pra dar
semântica a um gesto que o DS não modela (alça de `Reorder`/drag,
`role="tablist"` já resolvido por um DS component existente por dentro) —
aí o cru fica dentro da composition, não vira componente novo em lugar
nenhum.

## Modal, Drawer e Dialog nascem fechados — sempre

`Modal`, `Drawer` e `Dialog` do DS ficam **montados desde o primeiro
render**, e quem manda é a prop `open`. Nunca montar um deles já aberto:

```tsx
{isOpen && <Dialog open ... />}        // ❌ nasce aberto
{item && <Modal open={item !== null} />} // ❌ idem: só monta quando já abre
if (!item) return null                // ❌ o dialog abaixo nasce aberto
<Dialog open={isOpen} ... />          // ✅
```

O mesmo vale para **desmontar** um que ainda esteja aberto — um bloco
`{count > 0 && (<Drawer open={sheet} .../>)}` some com a folha aberta
quando a condição vira falsa.

**Why:** o Ark registra o bloqueio de ponteiro (`pointer-events: none` +
`data-inert` no `<body>`) durante o mount, mas só o desfaz ao observar a
transição de aberto→fechado. Nascer aberto ou morrer aberto pula essa
transição, e o bloqueio fica preso no body: a página renderiza perfeita,
nenhum clique funciona, nada aparece no console nem na aba Network, e só
F5 recupera. Custou uma investigação inteira em 2026-08-09 — o sintoma não
aponta para o dialog, aponta para "a aplicação travou".

Quando o conteúdo depende de um dado que some ao fechar, segurar o último
valor em state derivado mantém texto e id estáveis durante a animação de
saída (ver `ProductDetail` no consumer e `DeleteItemDialog` no manager):

```tsx
const [shown, setShown] = useState(item)
if (item && item !== shown) setShown(item)
```

`Modal` e `Drawer` são `lazyMount` + `unmountOnExit`, então um diálogo
montado e fechado não ocupa DOM — manter todos montados não custa nada.

## Quando componentizar

- Já existe em outro lugar → extrair e referenciar nos dois lugares
- Potencial real de reuso, mesmo que usado uma vez hoje → extrair como
  componente próprio
- Usado só uma vez e sem chance de repetir → fica inline, sem pasta nem
  arquivo separado

**Exceção por camada:** a partir do nível `compositions/` (modal com
estado/formulário, seção complexa), separar em arquivo próprio mesmo se
usado em um único lugar hoje — a complexidade do bloco já justifica o
isolamento, independente de reuso.

**Segundo critério, independente de reuso — SRP:** se um bloco de JSX já
tem estrutura e estilo próprios e dá pra nomear de forma descritiva, ele
sai pro próprio componente mesmo que só apareça uma vez hoje. Reuso e SRP
são dois motivos diferentes pra extrair — um bloco pode nunca se repetir e
ainda assim merecer ser seu próprio componente, porque fica confuso
deixá-lo solto dentro de outro.

## Skeleton de tela — onde mora

Todo componente de skeleton nomeado (`XSkeleton`, exportado à parte de quem
usa `isPending`) vive em `src/skeletons/`, **um por pasta**:
`src/skeletons/NomeSkeleton/NomeSkeleton.tsx` — mesma regra de "um
componente por pasta" de qualquer outro componente, não fica solto nem em
`compositions/`, nem em `pages/`. Alias `@skeletons/NomeSkeleton/NomeSkeleton`.

Reaproveitar o `.module.css` de quem o skeleton espelha é esperado (ver
"estratégia de construção" abaixo — mesmas classes de layout da tela real) —
isso não muda a pasta: importa o module do dono via alias
(`@pages/produto-detalhe/ProductDetail.module.css`,
`@compositions/OrderTicket/OrderTicket.module.css`), do mesmo jeito que
`MenuRow` importa o `.module.css` do `MenuBoard` pai.

## Skeleton de tela — estratégia de construção

Nunca criar skeleton de "achismo" (um bloco cinza genérico só pra cobrir o
`isPending`). Passo a passo:

1. Ler a página real (`.tsx`) inteira e o `.module.css` dela — não os
   componentes internos do DS (`Input`, `Select`, `Switch` etc.). A página
   e as próprias classes de layout que ela já define bastam pra saber
   largura, altura e espaçamento de cada bloco.
2. Mapear a árvore de elementos exatamente como ela é: contar quantos
   campos, quantos botões no rodapé, se tem linha de helper text/contador
   de caracteres, se tem uma barra de ação secundária (ex.: trocar/remover
   foto, criar categoria) — nada de arredondar "2 botões" quando são 3.
3. Construir o skeleton reaproveitando as MESMAS classes de estrutura da
   página (`.form`, `.row`, `.actions`, `.field` etc.), só trocando o
   conteúdo real por `<Skeleton>` do tamanho equivalente. Isso garante que
   layout/grid/breakpoints do skeleton sejam idênticos aos da tela real
   sem duplicar CSS.
4. Forçar o componente a sempre retornar o skeleton
   (`if (isPending || true) return <XSkeleton />`) só pra garantir que
   renderiza sem quebrar, e reverter antes de entregar. Não empacar em
   tentar reproduzir o estado de loading via rede lenta/mock de fetch —
   mais rápido forçar no código e reverter.
5. Validação visual final é pergunta, não ação automática: "posso
   confirmar o visual comparando com a tela real, ou você compara?" (ver
   `workflow.md`) — nunca abrir o browser sozinho por conta própria pra
   isso.

**Precedente** (nino-app/manager, 2026-08-03): `ProductDetailSkeleton` e
`NewProductSkeleton` (páginas de editar/criar item do cardápio) tinham sido
feitos de cabeça e ficaram com diferenças gritantes da tela real — faltava
a barra de "trocar/remover foto" sob a moldura, faltava a linha de
"42/300 · Aparece..." sob a Descrição, faltava o botão fantasma de "Criar
uma categoria", e o rodapé de `ProductDetailSkeleton` tinha só 2
botões-fantasma quando a tela real tem 3 (Excluir item, Cancelar, Salvar
alterações). Foram refeitos lendo a página + o CSS dela e reaproveitando as
classes existentes, validados forçando o render do skeleton no browser.

### Complexidade e responsabilidade única

Toda função dentro do `manager` deve ter responsabilidade única — nada de
função inchada fazendo várias coisas ao mesmo tempo (validar + calcular +
formatar + disparar efeito colateral, tudo junto). Quebrar em funções
menores e nomeadas. Usar injeção de dependência sempre que fizer sentido
(passar a dependência como parâmetro em vez de acoplar direto dentro da
função) — facilita teste e reuso.

### Atomic Design — pastas e critério de fronteira

(Definição de cada camada — Elements/Components/Compositions/Pages/Layouts —
já vem do hook `audit-architecture` a cada edição; não repetida aqui.)

No `manager` e no `consumer`, isso vira pasta: `src/elements/` (alias
`@elements`) para o que é atômico, `src/components/` (alias `@components`)
para o que compõe elements. Ao criar um componente novo, decidir a camada
antes de escolher a pasta — não colocar tudo em `components/`/
`compositions/` por padrão.

**Não compor nada é o critério, não onde mora hoje** (confirmado em
2026-08-05, quando 4 itens do `consumer` — `PoweredBy`, `AnimatedNumber`,
`AccountButton`, `OrderRail` — foram migrados de `components/`/
`compositions/` pra `elements/`): usar lógica de roteamento
(`useNavigate`, `useHref`) ou um `if` condicional simples não desqualifica
um element — os três elements do `manager` (`NinoLogo`, `Breadcrumb`,
`BackLink`) já fazem isso, e são wrappers finos de um componente do DS
convertendo a prop `to` em `href`/`onClick`. O que desqualifica é compor
**outro componente do app** (não do DS) ou carregar lógica de domínio real
(cálculo de estado de negócio, múltiplas fontes de dado).

### Responsividade

Todo componente/tela precisa funcionar em mobile, não só desktop — sem
largura fixa que quebre em telas pequenas, layout fluido (`flex`/grid) em
vez de dimensão hardcoded onde o conteúdo pode variar.

### Acessibilidade

Coberta pelo hook `audit-ui-accessibility` a cada edição (aria-hidden,
alt/aria-label, papel semântico, alvo de toque, foco, `prefers-reduced-motion`).
Único ponto que o hook não carrega: esses textos (`alt`, `aria-label`) ficam
em português — ver `code-style.md`, "Idioma".