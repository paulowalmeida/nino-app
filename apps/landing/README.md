# nino-landing

Landing pública do lojista (Next.js, SSG). Porta de dev `3005`. Consome o
design system `@nino/ds`. É superfície pública — apps autenticados ficam em
Vite SPA (ver `apps/manager/README.md`).

## Tailwind v4

Setup adicionado em jun/2026 (antes não havia Tailwind aqui — os `@apply` dos
`.module.css` eram ignorados em silêncio e os cards saíam sem estilo).

- `postcss.config.mjs` com `@tailwindcss/postcss`.
- `src/app/theme.css` — **único** CSS global, importado no `layout.tsx`:
  - `@import "tailwindcss"` + `@import "@nino/ds/tokens.css"` (paleta do DS).
  - bloco `@theme` com tokens próprios da landing, nomes semânticos por papel
    (body/muted/subtle p/ texto; surface/sand p/ fundos; acentos).
  - `@layer base` com `body` (bg cream, fonte, `overflow-x`), o grão global
    (`body::after`, via `public/noise.svg`) e `html { scroll-behavior }`.
- Cada `.module.css` que usa `@apply` começa com
  `@reference "../app/theme.css";` — o `;` é obrigatório (ver as pegadinhas
  Tailwind v4 em `packages/ds/README.md`).

Os CSS do protótipo HTML antigo (`landing.css`, `sections.css`, ~1470 linhas)
foram removidos — eram código morto; o global legítimo migrou para o
`@layer base` do `theme.css`.

## Componentes

Cada componente em pasta própria com CSS Module co-localizado e barrel
`index.ts`; nomes de classe semânticos (o module já escopa). Convenções
completas de estilo em `nino-app/CLAUDE.md`.

```
components/Hero/
  Hero.tsx · Hero.module.css · index.ts
  PhoneMockup/ (.tsx · .module.css · index.ts)
```
