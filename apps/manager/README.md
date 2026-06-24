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
demais para o tamanho do app). **Não instalar Zustand agora** — só quando
surgir o primeiro client state global real (complexidade especulativa).

## Contexto e autenticação

Backend: `nino-api` (NestJS + JWT + RBAC). Auth combina **role global**
(MERCHANT) com **role de tenant** (OWNER/MANAGER). Multi-tenant: um MERCHANT
pode ter N tenants (lojas) — após o login, um seletor de loja define o tenant
ativo, que passa a escopar todas as rotas.

## Roteamento

Mapa central via `createBrowserRouter`; o auth guard e o guard de assinatura
ativa viram branch no route map:

```
/entrar, /cadastro
/lojas                      ← seletor de tenants
/:tenantId/pedidos, /:tenantId/pedidos/:id
/:tenantId/catalogo         (produtos e categorias — CRUD)
/:tenantId/configuracoes
```

## Decisões técnicas

- **API client**: módulos por domínio (`auth`, `tenant`, `catalog`, `orders`)
- **Formulários**: `@nino/forms` (FormBuilder) para produto, categoria e dados
  da loja
- **Tenant selecionado**: client state (Zustand quando existir)
- **Tipos**: usar `@nino/lib` direto, sem redefinir

## Roadmap (fases)

1. Foundation (estrutura, API client, layout shell, sessão)
2. Auth (`/entrar`, `/cadastro`)
3. Seletor de tenants (`/lojas`)
4. Pedidos (lista + detalhe + status)
5. Catálogo (CRUD de produtos e categorias)
6. Configurações (loja, horários, pagamentos, contato)
