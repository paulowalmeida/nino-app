# @nino/ds

Design system compartilhado entre os 4 apps do Nino (consumer, manager,
courier, backoffice). Consumer, manager e courier são white-label — a marca
do unit entra via tokens CSS. O backoffice usa o tema default da Nino.

## Base

- **Primitivo:** [Ark UI](https://ark-ui.com) (`@ark-ui/react`) — a base dos
  componentes interativos. Resquício de Radix apenas no `Slot` do Button
  (`asChild`); as demais deps `@radix-ui/*` no `package.json` são órfãs
  (candidatas a remover).
- **Estilo:** Tailwind v4.
- **Cor oficial:** `--color-brand: #FF6B00`.
  - `--color-brand-hover`: `color-mix(in srgb, var(--color-brand) 85%, black)`
  - `--color-brand-active`: `color-mix(in srgb, var(--color-brand) 70%, black)`
  - Variação clara do tema:
    `color-mix(in srgb, var(--color-brand) 12%, transparent)` (ver DatePicker).

## Tokens & consumo pelos apps

A paleta vive em `src/styles/tokens.css` (bloco `@theme`, **fonte única**),
exportada como `@nino/ds/tokens.css`. O `globals.css` do DS faz
`@import './tokens.css'` e mantém só as fontes no próprio `@theme`.

Apps consomem de duas formas:

- **Import JS no entry:** `import '@nino/ds/globals.css'`.
- **Tailwind v4 (ex.: landing):** `@import "@nino/ds/tokens.css"` no CSS de
  tema — resolve cross-package, inclusive pelo `@reference`.

Cuidado com dois tokens parecidos: `surface` = `#f1f3f5` (cinza, do DS) vs
`paper` = `#fffbf5` (branco quente). Hexa sempre via token, nunca `bg-[#...]`.

### Por que `@source` no `globals.css` do DS

`globals.css` tem `@source` apontando para `../components` e `../lib`. O
Tailwind v4 escaneia o conteúdo a partir do diretório onde o PostCSS roda (o
app) e **ignora `node_modules`**. Como o `@nino/ds` é symlink em
`node_modules`, classes usadas só dentro dos componentes do DS (ex.:
`bg-brand`) nunca seriam geradas. O `@source` (relativo ao stylesheet) registra
os componentes do DS explicitamente, burlando o ignore. Portável: os apps
herdam ao importar `@nino/ds/globals.css`.

### Pegadinhas Tailwind v4 (valem em qualquer consumidor)

- Cada `.module.css` com `@apply` precisa de `@reference "<...>";` na 1ª linha,
  **terminando com `;`** — sem o ponto e vírgula o parser engole
  silenciosamente a 1ª regra do arquivo (sem erro no log).
- Gradiente/sombra multi-camada **não** funciona em `@apply ...-[valor]` (falha
  silenciosa, vira `none`) — escrever como `background:`/`box-shadow:` CSS puro
  multilinha.

## Convenções de componente

Cada componente tem:

```
Component.tsx · Component.types.ts · index.ts
Component.test.tsx · Component.stories.tsx
```

- Types nunca inline — sempre em `Component.types.ts`.
- Estilo via `@apply` em `.module.css` co-localizado (1ª linha
  `@reference "@nino/ds/globals.css";` — o `;` é obrigatório), `className={styles.x}`.
- JSDoc com `@param` por grupo.
- Testes em português com `describe(Component.displayName!)`.
- Portals do Ark precisam de `{ hidden: true }` nos queries do testing-library.
- `scrollIntoView` e `scrollTo` mockados no `setup.ts` (jsdom).

## Componentes

Alert, Avatar, Badge, Button, Carousel, Card, Checkbox, Clipboard, Collapsible,
ColorPicker, Combobox, DatePicker, Dialog, FileUpload, FormField, HoverCard,
Input, Label, Listbox, LoadingDots, Menu, Modal, NumberInput, OTPInput,
PageHeader, Pagination, PasswordInput, ProgressCircle, ProgressLine, QRCode,
RadioGroup, Rating, ScrollArea, Select, Separator, Skeleton, Slider, Spinner,
Stepper, Switch, TagsInput, Table, Tabs, Textarea, Toast, Tooltip.

Notas por componente:

- **Button** — variantes `primary`, `secondary`, `outline`, `ghost`, `inverse`
  (branco, texto `brand-strong`, shadow glow), `inverseOutline` (borda/texto
  branco) para superfícies de marca. Props: `size`, `loading`,
  `loadingIndicator` (`spinner`|`dots`), `asChild`. `destructive` foi removido —
  vermelho fica reservado ao padrão de confirmação no Dialog. Loading bloqueia
  cliques (disabled HTML) mas não aplica `opacity-50`.
- **Input / Textarea / Label** — migrados para a base `Field.*` do Ark
  (`Field.Input`/`Field.Textarea`/`Field.Label`). Com `strict: false`
  (`useFieldContext()?.`), degradam para elemento puro quando soltos e puxam o
  wiring (`aria-invalid`, `id`/`htmlFor`, `aria-describedby`) dentro de
  `Field.Root`. Estilo de erro keya em `[aria-invalid]`/`[data-invalid]`.
- **Checkbox / Select** — Ark UI, `size`, estado de erro, placeholder (Select).
- **Combobox** — Ark UI, busca/filtro client-side (`filterOptions` por label),
  base `ArkCombobox.Input`, erro via `[aria-invalid]`/`[data-invalid]`,
  `emptyMessage`.
- **ColorPicker** — essencial para o branding do unit (gestor escolhe a cor
  da loja). Ark color-picker completo (Area/AreaBackground/AreaThumb,
  ChannelSlider hue, ChannelInput hex, SwatchGroup com presets incl. `#FF6B00`).
  Emite hex via `e.value.toString('hex')`; `parseColor` para value/defaultValue.
- **PasswordInput** — `PasswordInput.Root` NÃO controla o valor;
  `value`/`onChange` vão no `.Input`. `VisibilityTrigger` precisa de `aria-label`.
- **QRCode** — Ark qr-code, `value` + `size` + logo overlay.
- **Tooltip** — Ark UI internamente.
- **Spinner / LoadingDots** — framer-motion, prop `visible`. LoadingDots faz
  bounce staggered.
- **Toast** — Ark UI, variantes, barra de progresso (framer-motion). Animação
  em CSS puro com data-attributes do Ark (Tailwind variants + `@utility` não
  funcionavam juntos).

### FormField + base Field

`FormField` é o wrapper universal de `Field.Root` (label + helper + error),
exportado no barrel. Prop `orientation?: 'vertical' | 'horizontal'` (default
vertical): horizontal põe controle + label na mesma linha (`flex items-center`)
com a mensagem embaixo — para Checkbox/Switch. Controles do Ark (Combobox,
Select…) consomem o contexto do Field automaticamente (aria-invalid e
label↔input wiram sozinhos dentro do FormField).

### Não criar

- **StatusBadge** — Badge já cobre success/error/warning/info/default; basta
  mapear o status de pedido para a variante.
- **TreeView**, **Swap** — sem uso no projeto.

## Decisões de Tailwind v4

- `@keyframes` fica **fora** do `@theme` (nested `@keyframes` no `@theme` não
  funciona no v4).
- Animação `.collapsible-content` reusa os keyframes do accordion no globals.
- Classes usadas **só** em `.stories.tsx` não são geradas (o `@source` do
  globals exclui stories) — usar `style` inline nas stories para dimensões.
- Gradiente/sombra multi-camada em CSS puro, nunca `@apply ...-[valor_gigante]`.

## Camada de formulário: `@nino/forms`

A lógica config-driven de formulário (schema → controle) **não** mora no DS —
fica no pacote `packages/forms` (`@nino/forms`), que depende de `@nino/ds` +
react-hook-form. O DS continua composição burra; o forms é a ergonomia
"descrevo campo como dado" para os forms repetitivos. Layout atípico usa o
modo composto do `FormBuilder`, ainda com `FormField` e controles do DS.

- `FieldConfig` — union discriminada por `type` (`text`/`textarea`/`select`/
  `combobox`/`checkbox`/`switch`).
- `renderField(field, control, error)` — mapeia o type para o controle do DS,
  embrulha em `FormField`, liga ao RHF via `Controller`.
- `FormBuilder` em modo schema — `useForm` + render dos campos. Botões via
  render-prop `footer`; sem `footer`, cai no default de 1 botão submit
  (`submitLabel`). Toggle sai horizontal automaticamente.
- `FormBuilder` em modo composto — render prop com o `UseFormReturn` tipado
  completo, `FormProvider` para descendentes e layout livre com os controles
  do DS. `formOptions` configura o RHF e `formProps` configura o `<form>`.
- vitest do forms usa alias `@nino/ds`→`../ds/src/index.ts`, `@ds`→`../ds/src`,
  reaproveita o `setup.ts` do ds. Tipos do jest-dom via `src/jest-dom.d.ts`.

## Testes — padrões aprendidos (drift do Ark)

Suíte estável; a maioria dos quebrados era teste desatualizado vs a versão
atual do Ark, não bug de produto.

- **Toggle (Checkbox/Switch/RadioGroup):** `data-state`/borda ficam no
  `control` (`[data-part="control"]`), não no elemento `role=checkbox`/input
  escondido. Switch não tem `role=switch`. Para "checked", usar `toBeChecked()`
  no input ou `data-state` no control.
- **Tabs:** Ark usa `data-selected`/`aria-selected="true"`, não
  `data-state="active"`.
- **Tooltip/Modal/Dialog fechados:** conteúdo fica montado-escondido — testar
  com `queryByRole('tooltip'|'dialog')`, não `queryByText`.
- **Select:** `HiddenSelect` nativo duplica `role=option` — escopar a query com
  `within(listbox)`.
- **Toast:** `toaster` é singleton de módulo; em `afterEach` usar
  `toaster.remove()` (limpa síncrono), não `dismiss()` (só anima, vaza).
- **Conteúdo posicionado (Select/Combobox/DatePicker):**
  `userEvent.setup({ pointerEventsCheck: 0 })`. No Combobox, `userEvent.type`
  multi-char perde chars pelo re-render da collection a cada tecla — filtrar
  com 1 char nos testes.
- **ScrollArea:** exigiu mock de `IntersectionObserver` no setup
  (`globalThis`, não `global`).
- jsdom não observa tecla Escape (Ark dialog) nem animação de saída
  (presence) — usar `waitFor` ou caminho controlado.

Validar com `tsc --noEmit` + `vitest run`. Storybook em `:6006`.

## Roadmap de novos componentes (sob demanda)

Plano completo em `proximos-componentes-ds.txt`. Pendentes notáveis:
ScrollArea/QRCode/ColorPicker já feitos; falta avaliar conforme os apps pedirem.
