# nino-manager

Painel de gestão do lojista — aplicação **autenticada** (atrás de login).
SPA React + Vite, React Router (data router) + react-query.

## Por que Vite SPA e não Next.js

Decisão de 2026-06-12: **todo app autenticado fica em SPA React puro**; Next.js
fica só em superfície pública (landing/marketing), onde SEO justifica. O manager
foi o primeiro a pivotar (de Next → React).

- É um painel atrás de login — SSR/RSC/prerender do Next não agregam (nada é
  indexado, o fetching é client-side com sessão).
- O **data router** do React Router modela melhor regras de acesso ricas (guard
  de assinatura ativa + role), e um route map central é mais legível que a
  convenção pesada do App Router.
- O **auth guard** vira um branch no `createBrowserRouter`, não middleware edge.

A regra vale para qualquer app futuro atrás de login (consumer, courier,
backoffice). O setup de Tailwind foi adaptado de Next para Vite.

## Arquitetura de estado

Regra central (fechada em 2026-06-15): **separar server state de client state.**

### Server state → react-query

Qualquer dado que vive na API (user, empresa, pedidos, produtos; a sessão
`/auth/me` também é server state). O cache mora no `QueryClient` (provider no
topo), nunca no componente — a leitura por `queryKey` é global e compartilhada
entre componentes sem parentesco.

react-query escala melhor que store manual: o maquinário
(cache/loading/error/dedupe/refetch/invalidação) é o mesmo para 1 ou 100
endpoints; escalar = adicionar uma key. Redux para dados de servidor obriga
reimplementar tudo isso à mão.

**Padrões obrigatórios** (evitam a "bagunça" que costuma ser má adoção):

- **Query key factory centralizada** (`queryKeys.user.detail(id)`), nunca
  strings soltas — senão a invalidação não bate e o cache duplica.
- **Hook por recurso** (`useUser()`, `useOrders()`) encapsulando o `useQuery`.
  O componente **não** chama `useQuery` cru — esse é o anti-padrão nº 1.
- react-query é **só** para server state; não usar para form/modal state.
- **Nunca** copiar cache para `useState` via `useEffect` — destrói o sync.
- Config global sã de `staleTime`/refetch, para não "piscar" loading.

### Client state global → Zustand

Sidebar colapsada, tema, tenant selecionado. **Não** Redux (RTK é cerimônia
demais para o tamanho do app). Instalado na fundação (M0), quando surgiram os
dois primeiros client states reais — stores em `src/states` (`@states`):

- `useSessionStore` — `user`, `memberships`, `currentTenantId`. `tenantRole` e
  o tenant atual **não** são estado: derivam por selector (`useTenantRole`,
  `useCurrentTenant`), para não duplicar verdade.
- `useUiStore` — `sidebarOpen`.

Regra: estado de servidor (pedidos, produtos, zonas) **nunca** entra em store.

## Contexto e autenticação

Backend: `nino-api` (NestJS + JWT + RBAC). Auth combina **role global**
(MERCHANT) com **role de tenant** (`TENANT_OWNER`/`MANAGER`/`STAFF`).
Multi-tenant: um MERCHANT pode ter N tenants (lojas) — após o login, um seletor
de loja define o tenant ativo, que passa a escopar todas as rotas.

Sessão é **cookie httpOnly** (`accessToken` 15min, `refreshToken` 7 dias), setado
pela API; o front nunca lê nem escreve token — só manda `credentials: 'include'`.

### Refresh transparente

No `ApiFactory` (`@services/api/api.service.ts`): 401 → `POST /auth/refresh` →
repete a request original 1x; segundo 401 (ou refresh que falha) limpa a sessão
e manda pro `/entrar`. Implementado com `retry` do ky em cima do 401 +
`beforeRetry`, e uma **promise de refresh compartilhada** — N requests que batem
401 juntas disparam **um** refresh só.

Rotas em `PUBLIC_PATHS` (login, signup, refresh, check-availability) ficam fora
disso: ali 401 é credencial errada, não sessão expirada.

## Roteamento

Mapa central via `createBrowserRouter`; guards são loaders, não middleware:

```
/                           ← RootLoader decide (ver abaixo)
/entrar, /cadastrar
/lojas                      ← seletor de tenants (N memberships)
/primeira-loja              ← onboarding (0 memberships)
/:tenantId/visao-geral, /:tenantId/pedidos, /:tenantId/pedidos/:id
/:tenantId/catalogo         (produtos e categorias — CRUD)
/:tenantId/colaboradores, /:tenantId/configuracoes
```

Regra da rota raiz (`RootLoader`): sem sessão → `/entrar`; 0 memberships →
`/primeira-loja`; 1 → `/:tenantId/visao-geral`; N → `/lojas`.

`AuthGuard` (grupo `/:tenantId`) exige sessão viva **e** tenant da URL entre as
memberships.

## Decisões técnicas

- **Atomic design**: `@elements` (átomos) → `@components` (moléculas burras) →
  `@compositions` (organismos) → `@layouts` → `@pages`. Componente burro recebe
  por props, não busca dado.
- **Fluxo de dados**: service (`ky`) → hook (TanStack Query/zustand) →
  componente (apresentação).
- **API client**: módulos por domínio (`auth`, `tenant`, `catalog`, `orders`);
  busca por id é sempre `getById`, nunca `show`.
- **Formulários**: `@nino/forms` (FormBuilder) para produto, categoria e dados
  da loja
- **Tipos**: `@custom_types` para os types do app; types da API virão de
  `@nino/api-types` (gerados do OpenAPI). **Não** usar `@nino/lib` — está stale,
  de antes do refactor.

## Pendências de contrato com a nino-api

Duas coisas do M0 estão inertes esperando a API (tarefa aberta lá):

1. **Memberships** — `/auth/me` não devolve as do próprio usuário, e a view
   reversa (`GET /user-tenants/user/:userId`) é backoffice-only. Enquanto isso
   `memberships` fica `[]`: o `AuthGuard` valida só a sessão (qualquer
   `:tenantId` passa) e a rota raiz sempre cai no braço de 0 → `/primeira-loja`.
   Quando a API entregar, o plug é preencher no `loadSession` e tirar o
   `memberships.length > 0` do guard.
2. **OpenAPI oco** — os 61 schemas saem vazios e nenhuma resposta declara
   `content` (falta `@nestjs/swagger/plugin` + DTOs de resposta). Por isso os
   types de auth estão escritos à mão em `@custom_types/auth`; trocar por
   `@nino/api-types` quando a anotação chegar.

## Setup de Tailwind e do `@nino/ds`

O DS é publicado como **TS cru** (`exports` aponta pra `src/index.ts`), então o
app consumidor compila as fontes dele. Duas consequências no `manager`:

- o alias interno do DS (`@ds/*`) precisa existir aqui também — mapeado no
  `vite.config.ts` e no `tsconfig.app.json`;
- `verbatimModuleSyntax` fica **desligado**: as fontes do DS importam type sem
  `import type` e quebrariam o build do app. Religar quando o DS passar a
  publicar `dist` + `.d.ts`.

O dev server roda na **3001** (`strictPort`) — é a origem que a API libera no
CORS por padrão.

## Roadmap (fases)

1. ✅ **M0 — Fundação**: estrutura atomic + aliases, refresh transparente,
   TanStack Query + query-keys, zustand, `@nino/api-types`, bootstrap de sessão
   e guards (membership pendente da API)
2. ✅ **M1 — Auth** (`/entrar`, `/cadastrar`) portado do `manager-legacy`
3. M2 — Shell do painel (Sidebar responsiva, StatCard, `/lojas` de verdade)
4. Pedidos (lista + detalhe + status)
5. Catálogo (CRUD de produtos e categorias)
6. Configurações (loja, horários, pagamentos, contato)
