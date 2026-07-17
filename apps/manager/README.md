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
Multi-tenant: **Company é a marca (o restaurante) e Tenant é a unidade** — uma
company tem N tenants. O tenant ativo escopa todas as rotas.

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

Regra da rota raiz (`RootLoader`), agrupando as memberships por **company**:

| Situação | Destino |
|---|---|
| Sem sessão | `/entrar` |
| 0 memberships | `/primeira-loja` (onboarding) |
| Lojas de **uma** company | `/:tenantId/visao-geral` da `isCurrent` |
| Lojas em **2+** companies | `/lojas` (escolha de restaurante) |

A distinção existe porque **Company é a marca e Tenant é a unidade**: duas lojas
da mesma company são unidades do mesmo negócio, e perguntar qual abrir é
fricção — entra na última usada e a troca de unidade fica no shell (switcher,
M2). Companies diferentes são restaurantes diferentes: aí a escolha vale tela.

`AuthGuard` (grupo `/:tenantId`) exige sessão viva **e** tenant da URL entre as
memberships.

Login e signup **não** semeiam a sessão: `POST /auth/login` não devolve
memberships, então quem popula a store é sempre o `loadSession` via `/auth/me` —
caminho único de bootstrap.

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

## Contrato com a nino-api

- **Memberships**: entregues por `GET /auth/me` (nino-api `feat/NAPI-10`), com
  `companyId`/`companyName` — sem eles o front não distingue troca de unidade de
  escolha de restaurante.
- **Types gerados**: `@nino/api-types` cobre os **requests** (o plugin do Swagger
  preenche os DTOs). As **respostas** ainda saem como `object` no OpenAPI, então
  os shapes de retorno que o manager consome (`me`, `login`, `signup`) seguem
  escritos à mão em `@custom_types/auth`. A conversão dos retornos em classes é
  débito registrado no `docs/todo.md` da API, para ser feita conforme cada
  controller for tocado.

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
   e guards
2. ✅ **M1 — Auth** (`/entrar`, `/cadastrar`) portado do `manager-legacy`
3. ✅ **M0.6 — Memberships**: guard de tenant efetivo e regra de entrada por
   company (depende da nino-api `feat/NAPI-10`)
4. M2 — Shell do painel (Sidebar responsiva, StatCard, switcher de unidade)
5. Pedidos (lista + detalhe + status)
6. Catálogo (CRUD de produtos e categorias)
7. Configurações (loja, horários, pagamentos, contato)
