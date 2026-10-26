# Tokens do nino × tema default do Tailwind v4

Levantamento arquivo a arquivo de `src/styles/tokens/`: o que duplica o
Tailwind, o que colide, e o que só existe aqui. Valores nativos conferidos na
doc do Tailwind v4 (`theme.css`).

## Regra em vigor

Decidida em 2026-08-12 e já aplicada aos arquivos de token:

1. **Token só existe onde o Tailwind não tem equivalente.** É o que define se
   um token se paga: o nome precisa carregar uma decisão que o Tailwind não
   toma por nós.
2. **Duplicado** (mesmo nome, mesmo valor) foi apagado — usa-se o nativo.
3. **Colidente** (mesmo nome, valor diferente) foi apagado — vale o valor
   nativo, mesmo quando o nosso era "melhor". Nome que existe nos dois lados é
   pior que valor subótimo: quem lê `leading-tight` não tem como saber qual
   dos dois está pegando.
4. **Sem prefixo.** Um prefixo `nino-` chegou a ser aplicado em todos os
   tokens e foi revertido: com a regra 1, tudo que não é nativo já é nosso, e
   o prefixo não desambigua nada.
5. **Estrutura fica com o Tailwind.** `flex`, `grid`, `p-4`, `gap-2` não
   carregam decisão de design nossa (ver seção final).

Consequência prática de 2 e 3: `leading-tight` passou de 1.15 para 1.25,
`shadow-md` deixou de ser quente, as três curvas base de easing viraram as do
Tailwind e `text-6xl` foi de 4rem para 3.75rem.

O laranja da marca **não** seguiu essa regra, e não é exceção — é a regra 1: o
colidente era o primitivo `orange-500`, não `--color-brand`, que é exclusivo.
O hex saiu do primitivo e passou a morar no semântico. `bg-orange-500` hoje é
o laranja do Tailwind; `bg-brand` é o do nino. Mesma coisa para `danger`,
`success` e `warning`, que dependiam de `red-700`, `green-700` e `yellow-800`.

O restante deste documento é o levantamento que embasou a decisão.

Três classificações:

- **Duplicado** — mesmo nome, mesmo valor. O token não carrega decisão
  nenhuma; apagar e usar o nativo.
- **Colidente** — mesmo nome, valor diferente. É o pior estado: parece o
  padrão e não é. Ou adota o nativo, ou apaga o namespace nativo e assume o
  nome.
- **Exclusivo** — não existe no Tailwind. É onde o token se paga.

---

## typography.css

### `--text-*`

| Token | Valor | Nativo | Situação |
|---|---|---|---|
| `3xs` | 0.5rem | — | Exclusivo |
| `2xs` | 0.625rem | — | Exclusivo |
| `xs` → `5xl` | idênticos | idênticos | **Duplicado** (10 tokens + line-heights) |
| `6xl` | 4rem | 3.75rem | **Colidente** |
| `7xl` | 4.5rem | 4.5rem | **Duplicado** |

As line-heights batem: o nativo usa razão (`calc(1.25 / 0.875)`), o nosso usa
rem (`1.25rem`), e o resultado computado é o mesmo. Nativo ainda tem `8xl` e
`9xl`, que não usamos.

**Recomendação:** apagar `xs`→`5xl` e `7xl`; manter `3xs`/`2xs`; decidir o
`6xl` (4rem é decisão real de hero da landing — se mantiver, o nome precisa
deixar de colidir).

### `--tracking-*`

| Token | Valor | Nativo | Situação |
|---|---|---|---|
| `tighter` `tight` `normal` `wide` `wider` `widest` | idênticos | idênticos | **Duplicado** (6 tokens) |
| `snug` | -0.01em | não existe | Exclusivo |
| `caps` | 0.14em | — | Exclusivo |
| `logo` | 0.25em | — | Exclusivo |

**Recomendação:** apagar os 6 duplicados, manter os 3 exclusivos.

### `--font-*`

`sans` e `display` — **Exclusivo** (o nativo aponta pra font stack genérica).
Manter.

---

## layout.css

### `--container-*`

Nomes (`page`, `block-*`) não colidem com os nativos (`3xs`→`7xl`). Dois
valores coincidem por acaso (`block` 42rem = `2xl` nativo; `block-md` 24rem =
`sm` nativo), mas o nome semântico é a decisão. **Exclusivo — manter.**

Se o objetivo é encolher escopo: o nativo traz 13 larguras acessíveis que
ninguém deveria usar. Candidato a `--container-*: initial` + redefinir os 6.

### `--leading-*`

| Token | Nosso | Nativo | Situação |
|---|---|---|---|
| `display` | 1.05 | — | Exclusivo |
| `tight` | 1.15 | 1.25 | **Colidente** |
| `snug` | 1.3 | 1.375 | **Colidente** |
| `normal` | 1.45 | 1.5 | **Colidente** |
| `relaxed` | 1.65 | 1.625 | **Colidente** |

Quatro colisões, todas sutis — a diferença é pequena o bastante para ninguém
notar que está usando outra coisa, e grande o bastante para mudar o desenho de
um parágrafo. **É o pior caso do levantamento.**

**Recomendação:** `--leading-*: initial` e redefinir os 5. Aí `leading-tight`
é inequivocamente o nosso 1.15.

---

## radius.css

`1`→`6` (4, 8, 12, 16, 20, 24px) contra `xs`→`4xl` do nativo. **Sem colisão de
nome.** Cinco dos seis valores existem no nativo com outro nome (4px=`sm`,
8px=`lg`, 12px=`xl`, 16px=`2xl`, 24px=`3xl`); 20px não existe.

Não é duplicação técnica, é vocabulário paralelo — e hoje coexistem **14
raios** acessíveis (6 nossos + 8 nativos).

**Recomendação:** `--radius-*: initial` + manter a escala numérica. O ganho não
é byte, é ter um jeito só de escolher raio.

---

## elevation.css (`--shadow-*`)

| Token | Situação |
|---|---|
| `xs` `sm` `md` `lg` `xl` | **Colidente** — nomes nativos, valores nossos (tinta `warm-950`, offsets próprios) |
| `up` | Exclusivo (projeta pra cima) |
| `warm-sm` `warm-md` `warm-lg` | Exclusivo (tinta `burnt-900`, landing) |
| `brand` `brand-lg` | Exclusivo (halo de marca) |

A tinta quente é decisão real — sombra preta sobre creme acinzenta. O problema
é só o nome dos cinco primeiros.

**Recomendação:** `--shadow-*: initial` + redefinir os nossos. Elimina de uma
vez a colisão e os `2xs`/`2xl` nativos que ninguém usa.

---

## motion.css

### `--ease-*`

| Token | Nosso | Nativo | Situação |
|---|---|---|---|
| `out` | 0.16, 1, 0.3, 1 | 0, 0, 0.2, 1 | **Colidente** |
| `in` | 0.32, 0, 0.67, 0 | 0.4, 0, 1, 1 | **Colidente** |
| `in-out` | 0.45, 0, 0.15, 1 | 0.4, 0, 0.2, 1 | **Colidente** |
| `out-soft` | — | não existe | Exclusivo |
| `back` | — | não existe | Exclusivo |

Agravante: `ease-in`/`ease-out`/`ease-in-out` também são **keyword CSS nativa**.
Dentro de `animation:`/`transition:` o navegador usa a keyword, não o token —
então hoje o mesmo nome significa duas curvas diferentes dependendo de onde
está escrito. Foi exatamente o que quebrou as animações durante o rename.

**Recomendação:** renomear as três (ex.: `ease-enter`, `ease-exit`,
`ease-sweep`) em vez de apagar o namespace. Apagar não resolve a colisão com a
keyword CSS; só renomear resolve.

### `--duration-*`

`fast` `base` `slow` `slower` — **Exclusivo** (o nativo só tem número). Manter.
As `@utility duration-*` declaradas à mão continuam necessárias.

---

## opacity.css

`watermark` `faint` `disabled` `dim` `strong` — **Exclusivo** (o nativo só tem
número). Manter.

---

## layer.css (`--z-*`)

12 tokens (`below` → `grain`) — **Exclusivo**, o Tailwind não tem escala
nomeada de z-index. É o arquivo com melhor retorno do conjunto. Manter inteiro.

---

## color.css e primitives.css

Toda a camada semântica (`brand-*`, `surface-*`, `fg-*`, `danger`, `success`,
`warning`, `accent-*`, `input-*`, `border`) é **Exclusiva**. É o produto.

Nos primitivos há colisão de nome com a paleta nativa, sempre com valor
diferente:

| Nosso | Nativo |
|---|---|
| `orange-400/500/600` | mesmos nomes, oklch diferente |
| `green-100/700`, `red-100/700`, `yellow-100/400/800`, `lime-400` | idem |
| `warm-*`, `cool-*`, `peach-*`, `burnt-900`, `clay-500`, `whatsapp-500` | não existem no nativo |

**Recomendação:** `--color-*: initial` + redefinir. Além de resolver a colisão,
é o namespace onde "usar o que não é nosso" mais acontece na prática —
`bg-slate-500` some do vocabulário.

**Custo medido:** ~70 usos de cor nativa em `apps/landing` (demo) e ~30 em
stories do DS. Zero nos 4 apps autenticados.

---

## Resumo

| Arquivo | Duplicado | Colidente | Exclusivo |
|---|---|---|---|
| typography (`text`) | 11 | 1 | 2 |
| typography (`tracking`) | 6 | 0 | 3 |
| typography (`font`) | 0 | 0 | 2 |
| layout (`container`) | 0 | 0 | 6 |
| layout (`leading`) | 0 | 4 | 1 |
| radius | 0 | 0 | 6 |
| elevation | 0 | 5 | 6 |
| motion (`ease`) | 0 | 3 | 2 |
| motion (`duration`) | 0 | 0 | 4 |
| opacity | 0 | 0 | 5 |
| layer | 0 | 0 | 12 |
| color + primitives | 0 | 11 | ~65 |

**17 tokens são puro retrabalho** (duplicado). **24 são armadilha** (colidente:
mesmo nome, valor diferente). O resto se paga.

### Por que o escopo passou a importar

`@theme static` — necessário para que var usada apenas dentro de `.module.css`
seja emitida (sem ele a tela de login perde o painel escuro) — emite **todas**
as vars do tema, não só as usadas. Enxugar deixou de ser estética e passou a
valer bytes em todo app.

---

## Valores arbitrários

478 ocorrências de `utility-[valor]` no monorepo. Nem toda é dívida:

| Padrão | Nº | Veredicto |
|---|---|---|
| `data-[...]`, `group-data-[...]` | 119 | Legítimo — seletor de atributo, não valor |
| `grid-cols-[...]`, `animate-[...]`, `transition-[...]` | 36 | Legítimo — layout/animação específicos |
| `tracking-[...]` | 100 | **Dívida** — cabe em token (`caps` já existe) |
| `w-[...]`, `h-[...]` | 78 | **Dívida** — maioria cabe na escala de spacing |
| `text-[13px]` e afins | 23 | **Dívida** — fora da escala tipográfica |
| `py/px/mt/gap/pb/pt-[...]` | ~50 | **Dívida** — cabe na escala de spacing |
| resto (`right`, `bottom`, `aspect`, `max-h`…) | ~70 | Caso a caso |

Dívida real: ~250 ocorrências. As 100 de `tracking-[...]` são o alvo mais
óbvio — um punhado de valores repetidos que deveriam ser dois ou três tokens.

---

## Utilities estruturais — o que dá e o que não dá para restringir

### Espaçamento não é lista de tokens, é fórmula

`p-4`, `gap-2`, `mt-6`, `w-11` saem todos de **um** token: `--spacing:
0.25rem`. O Tailwind multiplica sob demanda, então `p-13` e `p-77` existem sem
ninguém ter declarado nada. Não há como podar um degrau: ou mantém a fórmula
inteira, ou apaga com `--spacing: initial` e declara cada degrau à mão
(`--spacing-1`, `--spacing-2`, …).

Uso real hoje — 25 valores distintos, todos coerentes com a escala:

```
0 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 40 44 60
```

Volume: `gap` 433, `h` 357, `w` 294, `mt` 264, `px` 239, `py` 190, `p` 131.

Não há sinal de bagunça aqui — os degraus usados são os da escala, sem
invenção. A inconsistência mora nos valores arbitrários (`w-[42px]`), que são
outro problema.

**Recomendação:** manter a fórmula. Congelar em 25 degraus declarados trava
`p-13` acidental, mas cobra manutenção toda vez que uma tela precisar de um
degrau novo — e o levantamento mostra que ninguém está inventando degrau.

### Layout não vem de token nenhum

`flex` (1315), `block` (512), `grid` (311), `hidden` (307), `items-center`
(301), `flex-col` (226), `shrink-0` (175), `flex-1` (119), `justify-*`,
`col-span-*`, `order-*` — nada disso lê o `@theme`. São utilities estáticas
(ou geradas por fórmula, como `grid-cols-N`). **Não existe mecanismo de tema
para restringi-las**, e também não há motivo: não existe "flex do nino"
divergindo do flex do Tailwind. Fonte de inconsistência: zero.

**Conclusão:** a restrição só faz sentido nos namespaces que carregam decisão
de design — cor, sombra, raio, tipografia, easing. Estrutura fica como está.
