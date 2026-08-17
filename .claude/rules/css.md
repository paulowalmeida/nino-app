# Estilo / CSS

Convenções de CSS para todos os apps do nino-app (landing e manager). Setups de
Tailwind com pegadinhas de build: ver `apps/landing/README.md` e
`apps/manager/README.md`.

## Tailwind-first via CSS Module co-localizado

Padrão canônico: estilo do componente em `Component.module.css` com `@apply`, no
JSX `className={styles.x}`. **Não** usar string de classe inline no JSX nem
constante nomeada (formatos antigos, descartados).

(Checklist de sintaxe — `@reference` na 1ª linha, nomes semânticos/camelCase,
gradiente em CSS puro, hex via token — é reforçado pelo hook `audit-css` a
cada edição de `.module.css`; não repetido aqui.)

- Composição de múltiplas classes no JSX via template literal:
  `${motion.rise} ${styles.header}`
- Chrome repetido entre componentes (ex.: forms de auth) vira um module
  compartilhado em vez de triplicar

## Organização por componente (sobretudo na landing)

Cada componente em pasta própria com CSS Module co-localizado e barrel
`index.ts`; types em arquivo próprio `Component.types.ts`:

```
components/Hero/
  Hero.tsx · Hero.module.css · index.ts
  PhoneMockup/ (.tsx · .module.css · index.ts)
```

**No `manager`, esse `index.ts` de barrel NÃO é usado** — nenhuma pasta de
componente tem barrel, mesmo sendo pasta própria; import é sempre direto do
arquivo (`@components/Nome/Nome`, nunca `@components/Nome`). Ver
`code-style.md` (barrel) e `components.md` (types inline). Esse padrão com
`index.ts` + `Component.types.ts` acima vale pra landing/DS, não pro
`manager`.

Componentizar o que for autônomo (mockup, cartões viram componentes próprios).
Evitar CSS global gigante com classes genéricas (`.cta`, `.s-item`) — impossível
manter e fonte de colisão.

## Token só existe onde o Tailwind não tem

Regra decidida em 2026-08-12. Antes de criar um token novo em
`packages/ds/src/styles/tokens/`, checar se o Tailwind já tem o nome:

- **Nome e valor iguais aos do Tailwind** → não criar, usar o nativo.
- **Nome igual, valor diferente** → não criar. Vale o valor nativo. Um nome
  que existe nos dois lados é pior que um valor subótimo: quem lê
  `leading-tight` não tem como saber qual dos dois está pegando. Se o valor
  for inegociável, o token precisa de um nome que o Tailwind não use
  (`leading-display`, `tracking-caps`, `shadow-warm-md`).
- **Não existe no Tailwind** → é aí que o token se paga (`--z-*`,
  `--opacity-disabled`, `--duration-base`, `--container-page`, toda a camada
  semântica de cor).

Sem prefixo (`nino-`): com a regra acima, tudo que não é nativo já é nosso.

Cor de marca não mora em primitivo com nome de paleta do Tailwind — o hex fica
no semântico (`--color-brand: #ff6b00`), nunca em `--color-orange-500`, que é
nome dele. Levantamento completo, arquivo a arquivo, em
`packages/ds/docs/tokens-vs-tailwind.md`.

Estrutura (`flex`, `grid`, `p-4`, `gap-2`) é do Tailwind e fica como está —
não carrega decisão de design nossa.

## Tokens do DS sobre hex/rgba

Preferir tokens de cor do `@nino/ds` a hex/rgba arbitrário **quando o valor é
idêntico**. Mapeamento (definidos em `packages/ds/src/styles/tokens.css`):

- `#ff6b00` → `brand` · `#e8540c` → `brand-strong`
- `#fff7ee` → `cream` · `#ffebd6` → `cream-deep` · `#1a1206` → `ink`
- `rgba(255,107,0,X)` → `brand/X` (ex.: `border-brand/12`)
- `brand-soft` = `brand` a 12%

Trocar só os utilities diretos (`text-[...]`, `bg-[...]`, `border-[...]`). NÃO
mexer em cores dentro dos gradientes Vitrine (`bg-[linear-gradient(...)]`): a
paleta Vitrine (laranjas do gradiente, marrons `#6b5d4d`/`#9a8b78`, creams
`#fffbf5`/`#fff3e9`) NÃO tem token e fica como arbitrary value fiel. A escala
default do Tailwind (orange-x/stone-x) foi descartada — não bate exato.

## Fundo branco nos apps; quente só na landing

**Fundo de tela** nos apps (`manager`, `consumer`, `courier`, `backoffice`) é
**branco puro** (`#fff`) — a casca, o `main`, a página. Nada de `bg-cream` ou
`bg-paper` como fundo de tela.

**Dentro da tela, cream continua valendo**: cartão, faixa de destaque, bloco de
dado imutável, hover de item, esqueleto, chip. É assim que um bloco se separa do
papel branco sem precisar de moldura — a faixa do CNPJ na tela de empresa e a de
disponibilidade na ficha do produto são o exemplo canônico.

A regra em uma linha: **o papel é branco, a tinta pode ser quente.**

Na landing o clima manda e a tela inteira segue quente — cream com grão e glow
radial laranja continua o padrão de lá.

## Vocabulário visual dos apps

Peças que se repetem entre telas. Reusar antes de inventar variante nova.

- **Cabeçalho de tela/seção:** eyebrow em versalete (`text-[0.7rem] font-bold
  uppercase tracking-[0.12em] text-faint`), título em `font-display
  font-extrabold tracking-[-0.02em]`, subtítulo `text-sm text-subtle`.
- **Blocos dentro do formulário:** separados por `border-t border-sand` + o
  mesmo eyebrow, nunca por cartão dentro de cartão. A seção já é a tela.
- **Rodapé de ação:** `border-t` + `sm:justify-end`, primária na ponta; largura
  cheia no celular. Ao lado, quando o botão está desabilitado, uma linha em
  `text-xs text-faint` dizendo por quê.
- **Identidade de loja/empresa:** azulejo `rounded-card bg-brand-soft` com a
  inicial em `font-display text-brand-strong`, nome ao lado e link/CNPJ
  embaixo — mesma peça do `StoreHeader` do consumer. Dado imutável (CNPJ) é
  placa, não input desabilitado.
- **Numeração:** só quando a ordem é informação real (etapas de cadastro,
  paradas de um pedido). Lista de coisas paralelas usa marcador simples.
- **Demonstrar o produto:** montar o componente real com dado de mentira
  (`pages/welcome/demo-order.ts`), dentro de moldura com o nome da tela,
  `inert` + `aria-hidden`. Nada de mockup desenhado à parte, que envelhece
  sozinho.
- **Piso de qualidade:** responsivo até 390px, foco visível no teclado,
  `prefers-reduced-motion` respeitado, alvo de toque ≥ 44px.

Largura máxima varia com o conteúdo (`max-w-2xl` num formulário, `max-w-5xl`
numa lista), e isso é decisão de tela — o recuo, não. (80 chars/linha e
`p-4 lg:p-10` na `.page`, com exceções de `kitchen`/`first-store`/
`store-selection`, já vêm do hook `audit-css` a cada edição.)

## SVG — app nunca toca em arquivo de ícone

Todo ícone vive em **um lugar só**: `packages/ds/src/assets/icons/`. App
consome exclusivamente pelo componente do DS, por nome:

```tsx
import { Icon } from '@nino/ds/components/Icon'

<Icon name="trash" size="md" className={styles.icon} />
```

**Proibido no app:** importar `.svg` (com ou sem `?raw`), escrever `<svg>`
à mão no JSX, criar componente `.tsx` por ícone, ou manter pasta
`assets/icons/` própria. Se o ícone não existe, ele é adicionado ao DS —
não contornado localmente.

### Como adicionar um ícone ao DS

1. Colocar o `.svg` em `packages/ds/src/assets/icons/`, no mesmo formato dos
   existentes (`viewBox="0 0 24 24"`, `stroke="currentColor"`, sem
   `width`/`height` fixos — é o formato do [Feather](https://feathericons.com),
   fonte de todo o catálogo atual).
2. Rodar `npm run icons:sprite -w @nino/ds`.
3. Commitar o `.svg`, o `icons.sprite.svg` e o `Icon.names.ts` regerados.

`icons.sprite.svg` e `Icon.names.ts` são **gerados** — nunca editar à mão.
`Icon.types.ts`, ao lado deles, é escrito à mão (guarda `IconSize` e reexporta
`IconName`) e sobrevive ao script.
O tipo `IconName` e a lista `ICON_NAMES` saem do próprio conteúdo da pasta,
então não existe lista pra sincronizar manualmente.

**Why (entrega):** o catálogo tem 300+ ícones. Um `Record` com todos
importados de forma estática colocaria os 300 no bundle de quem usasse um;
um chunk dinâmico por ícone gerava 300 requisições e um flash de conteúdo
vazio no primeiro render. O sprite `<symbol>` + `<use href="...#nome">`
resolve os dois: **uma** requisição de ~12 kB gzipped, cacheada por hash, e
render síncrono sem estado de loading. Migrar os 30 ícones estáticos pro
sprite de 301 ainda *reduziu* o bundle principal do manager (352 kB → 344 kB)
e cortou 300 arquivos de `dist/assets`.

### Nome do arquivo descreve a forma, nunca a categoria de uso

`trash.svg`, `chevron-down.svg`, `credit-card.svg` — nunca um prefixo que
diz onde o ícone é usado (`nav-card.svg`, `menu-trash.svg`). O ícone pode
ser reaproveitado fora do contexto original, e o prefixo de categoria não
descreve o desenho — é o mesmo erro que classe CSS com prefixo defensivo
(`.auth-grain` em vez de `.grain`), aplicado a nome de arquivo.

Duas ou mais formas parecidas (`chevron-up.svg`/`chevron-down.svg`,
`trash.svg`/`trash-thin.svg`) precisam do sufixo que distingue **a
variação visual**, não o local de uso.