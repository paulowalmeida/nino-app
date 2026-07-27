# Adoção do `@nino/ds` no gestor — o que ficou de fora e por quê

Auditoria de 20 páginas e 24 compositions do `apps/manager`, feita em
2026-07-27. Ponto de partida: o gestor importava **27 dos 57** componentes do
DS. A pergunta era se os outros 30 estavam parados por descuido.

Resultado: **6 renderam adoção** (`Alert`, `Badge`, `Card`, `ColorPicker`,
`Avatar`, `Stepper`). O resto tem motivo. Este documento registra os motivos,
para não reabrir a mesma investigação daqui a três meses.

Regra que orientou as decisões: **o DS é a fonte da verdade visual**. Onde o
app e o DS divergiam em aparência, o app cedeu. Por isso as recusas abaixo são
quase todas **técnicas** — divergência estética não era argumento válido.

---

## 1. Componentes do DS que não servem ao caso do gestor

Estes foram avaliados contra código real e reprovaram por limite de API, não
por gosto.

### `Breadcrumb` — quebraria a navegação SPA

`packages/ds/src/components/Breadcrumb/Breadcrumb.tsx` renderiza `<a href>`
puro. O gestor tem `components/Breadcrumb` local que usa `Link` do react-router
com `relative="path"`, e as telas dependem de `to=".."`.

Adotar o do DS causaria recarga de página inteira a cada clique de trilha.

**Para levar ao DS:** aceitar um slot de elemento de navegação (`asChild`, ou
uma prop `renderLink`), para que cada app injete o `Link` do seu roteador.

### `Pagination` — o gestor não tem total de itens

`Pagination.types.ts` exige `count` (total) para calcular as páginas. Orders e
Customers usam infinite query por cursor: existe `hasNextPage`, nunca o total.

**Para levar ao DS:** um modo cursor (`hasNext`/`hasPrevious` + callbacks), sem
numeração de páginas.

### `NumberInput` — não tem os botões que o caso precisa

É um `<input type="number">` sem incremento/decremento. Os `+`/`−` de
quantidade em `SaleTicket` e `NewOrder` são alvos de toque grandes, usados no
balcão com o dedo. Trocar seria regressão de usabilidade.

**Para levar ao DS:** variante com steppers laterais e alvo de 44px.

### `Drawer` — o sidebar é fixo e drawer ao mesmo tempo

O `<aside>` de `layouts/AppLayout/Sidebar` é painel fixo no desktop
(`lg:translate-x-0`, com largura colapsável) e gaveta no mobile. O `Drawer` do
DS é um `Dialog` do Ark com portal e header próprio, sem noção de "documento
fixo". Adotar exigiria manter duas implementações do mesmo sidebar.

### `FileUpload` — não cobre o fluxo de foto do produto

`compositions/ItemPhoto` precisa de duas coisas que a API não dá: exibir uma
imagem **já hospedada** (`cover.url`) fora do fluxo de seleção, e entregar o
`File` bruto para o `PhotoCropper` **antes** do upload. O `FileUpload` gerencia
preview internamente via `ArkFileUpload.Context`.

### `PageHeader` — o gestor já faz melhor

Descartado depois de medir. `PageHeaderProps.title` é `string`, então não
comporta o sublinhado peach que `components/PageTitle` desenha via `accent` —
identidade herdada da landing, presente em 12 telas.

E o slot `actions`, principal razão de existir do componente, serviria a **1**
das 12 páginas (só `Catalog` tem ações no cabeçalho). Os títulos são
equivalentes: `PageTitle` é `text-xl lg:text-2xl font-extrabold`, `PageHeader`
é `text-2xl font-bold`.

**Para levar ao DS:** `title` como `ReactNode` (mudança de uma linha, não
quebra chamador nenhum) e o sublinhado como recurso do próprio `PageHeader`.
Só então a adoção passa a valer.

---

## 2. Markup caseiro que fica, por decisão de produto

Estes parecem candidatos, mas o desenho atual é deliberado — há comentário no
CSS explicando, em quase todos.

- **`KitchenCard`** (`pages/kitchen`) — pills e fita de prazo compõem a
  estética de "comanda térmica" (máscara picotada, gradiente, animação
  `breathe`). `Badge` e `ProgressLine` genéricos apagariam isso.
- **`Reports` `.position`** — o chip de ranking é quadrado e escuro de
  propósito, com líder em laranja e top-3 em preto. `Badge` tem paleta fixa,
  sem efeito de pódio.
- **`MenuBoard` item esgotado** — opacidade e preço riscado. O comentário no
  CSS é explícito: *"Sold out reads as absence, not as a badge."*
- **`ServiceRules` chips de pagamento** — são `<button aria-pressed>` de
  seleção múltipla. Não mapeiam para `Checkbox` nem `RadioGroup`; o DS não tem
  toggle group.
- **`WeekSchedule`** — 7 linhas curtas com `Switch` e `TimePicker`. Não há o
  que esconder num `Collapsible`.

---

## 3. Superfícies que o `Card` não alcança

O `Card` do DS é um `<div>` sem `asChild`. Três superfícies do gestor são
**elementos clicáveis**, e envolvê-las mudaria o alvo de clique e o anel de
foco:

- `compositions/QueueBoard` `.tile` — é um `<Link>`
- `compositions/DayTally` `.figure` — é um `<Link>`
- `pages/store-selection` `.store` — é um `<button>`

**Para levar ao DS:** `asChild` no `Card`, como o `Button` já tem.

Também ficou de fora `styles/settingsCard.module.css`: só a classe `.card` saiu
(virou `<Card>`). As outras 10 — `.row`, `.group`, `.rowLabel`, `.groupTitle`,
`.rowHint`, `.head`, `.title`, `.hint`, `.save`, `.empty` — descrevem a
**estrutura interna** de um bloco de configuração, e o DS não tem equivalente.
Apagá-las exigiria reescrever 6 compositions.

---

## 4. Lacuna real do DS: `EmptyState`

A única coisa que faltou no DS, e não no app.

O gestor tem ~10 estados vazios com CSS próprio (`.empty`, e `.notice` usado
como vazio): carrinho sem itens, cardápio vazio, nenhum colaborador, cliente
sem histórico, fila parada, relatório sem dados.

Não viraram `Alert` de propósito: estado vazio é **ausência de conteúdo**, não
status. O `Alert` traz ícone e superfície colorida onde a tela quer silêncio, e
seu `role="alert"` é assertivo — o leitor de tela interromperia para anunciar
"nenhuma categoria ainda".

**Proposta:** componente `EmptyState` no `packages/ds` — ícone opcional,
título, texto e ação — antes de tentar padronizar essas telas.

---

## 5. Componentes do DS ainda sem uso no gestor

Não foram reprovados; simplesmente não há caso hoje. Ficam de olho para quando
aparecer:

`Carousel`, `Checkbox`, `Clipboard`, `Collapsible`, `Combobox`, `HoverCard`,
`Label`, `Listbox`, `LoadingDots`, `OTPInput`, `Popover`, `ProgressCircle`,
`ProgressLine`, `QRCode`, `RadioGroup`, `Rating`, `ScrollArea`, `Separator`,
`Spinner`, `TagsInput`, `Tooltip`.

Dois com caso provável à vista:

- **`QRCode`** — cardápio da loja para mesa, hoje inexistente
- **`Clipboard`** — copiar link de convite em `InviteForm`, hoje sem botão

---

## 6. Mudança feita no DS

Uma só, em `packages/ds/src/components/Avatar/Avatar.tsx`: a cor do texto saiu
do fallback e foi para a raiz.

O fallback é filho do root, então `text-muted` fixo nele tornava a cor das
iniciais inalcançável por `className`. Sem isso, os três tons do `PersonMark`
(`brand`, `quiet`, `night`) ficariam com fundo colorido e texto cinza. Na raiz,
`className` sobrescreve via tailwind-merge e o fallback herda por cascata.

---

## Nota sobre `.claude/rules/css.md`

A regra pede superfícies quentes translúcidas (`bg-white/75` + blur) e foi
deixada de lado nesta adoção: os componentes do DS foram atualizados em
2026-07-27 e o arquivo de regra não tem nenhum commit. Ficou desatualizado
frente ao DS — vale revisar ou remover o trecho de superfícies.
