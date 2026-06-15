# Plano — Construção do painel do nino-manager

## Contexto

O `nino-manager` (`nino-app/apps/manager`) é o app Next.js usado por
TENANT_OWNER / MANAGER / STAFF para operar uma loja de delivery. Hoje só
existem **auth + onboarding + shell do painel**: login, cadastro em 2 passos,
e o layout `/painel` com sidebar. As 4 áreas de operação que a sidebar já
linka estão vazias (rotas inexistentes) e os cards do dashboard mostram `—`
hardcoded.

A API (`nino-api`, NestJS) já expõe quase tudo que o manager precisa
(produtos, categorias, pedidos, configurações da loja, horários, métodos de
pagamento, couriers, user-tenants). **Exceção:** o módulo de **Invite** ainda
não existe no backend — "Colaboradores" depende dele.

Objetivo: planejar e construir as 4 áreas (Cardápio, Pedidos, Configurações,
Colaboradores), ligar os dados reais e introduzir TanStack Query como camada
de data fetching.

Decisões tomadas com o usuário:
- Escopo: as 4 áreas.
- Data fetching: **introduzir TanStack Query** (substituindo fetch puro nas
  telas novas; auth/onboarding atuais permanecem como estão).

---

## Fundação (Fase 0 — pré-requisito de tudo)

### 0.1 — TanStack Query
- Adicionar `@tanstack/react-query` ao `apps/manager/package.json`.
- Criar `src/app/providers.tsx` (client component) com `QueryClientProvider`
  + `QueryClient` singleton; envolver `children` no `src/app/layout.tsx`.
- Convenção: cada domínio terá um arquivo de hooks
  (`src/features/<dominio>/queries.ts`) com `useQuery`/`useMutation` chamando
  os services. Query keys padronizadas: `['products', tenantId]` etc.

### 0.2 — Resolver o tenant atual (bloqueador)
Hoje não há como saber o `tenantId`. `me()` devolve `User` (com `companyId`,
sem tenant). Caminho de resolução:
`me()` → `userId` → `GET /user-tenants/user/:userId` → escolher o
`UserTenant` corrente (`isCurrent`/primeiro) → `tenantId` + `tenantRole`.

- Novo service `src/services/tenant-context.service.ts`:
  `getUserTenants(userId)` usando `get(httpConfig(...), '/user-tenants/user/' + userId)`
  (tipo `UserTenant` já existe em `@nino/lib`).
- Novo contexto `src/contexts/TenantContext.tsx` expondo
  `{ tenantId, tenantRole, tenant }` + hook `useCurrentTenant()`.
- Integrar no `src/app/painel/layout.tsx`: depois de `useAuthUser()`,
  resolver tenant; enquanto resolve, `<FullScreenLoader />`.
- `tenantRole` habilita o gate de permissões na UI (ver 0.4).

### 0.3 — Services + tipos
- Tipos já existem em `@nino/lib/src/types/`: `product/`, `order/`, `tenant/`
  (inclui `tenant-settings`, `opening-hours`, `tenant-payment-method`,
  `tenant-phone`), `user/` (`user-tenant`), `courier/`. **Reusar**, não recriar.
- Um service por domínio em `src/services/`:
  `product.service.ts`, `product-category.service.ts`, `order.service.ts`,
  `tenant.service.ts` (settings/hours/payment), `team.service.ts`.
  Todos seguem o padrão existente: funções puras usando `httpConfig()` +
  `get/post/patch/del` de `@nino/lib`.

### 0.4 — Gate de permissões na UI
- Helper `src/lib/permissions.ts` mapeando `TenantRole` → ações
  (ex.: STAFF não vê billing/settings nem lista geral de pedidos; MANAGER não
  vê settings/billing). Baseado em `docs/profiles.md`.
- Sidebar (`painel/_components/Sidebar`) filtra itens por papel.

---

## Fase 1 — Cardápio (`/painel/cardapio`)

Base da loja. Endpoints prontos (`/tenants/:tenantId/products` e
`/tenants/:tenantId/product-categories`).

- Rota `src/app/painel/cardapio/page.tsx`: lista produtos agrupados por
  categoria; usar DS `Table` ou cards, `Badge` para ativo/inativo, `Spinner`/
  `Skeleton` em loading (via `useQuery`).
- CRUD produto: `Dialog`/`Drawer` do DS + formulário (`react-hook-form` ou
  `@nino/forms` FormBuilder) com `Input`, `NumberInput` (preço), `Select`
  (categoria), `Switch` (ativo), `Textarea`. `useMutation` + invalidação da
  query key `['products', tenantId]`.
- CRUD categoria: gerenciador simples (modal) com ordenação por `position`.
- Modificadores (`ProductModifier`/options): incluir se a API expõe rota;
  caso contrário, fase posterior.
- Tratar limite de plano: a API rejeita criação acima de `maxProducts` —
  exibir o erro retornado via `Toast`/`Alert`.
- Permissão: OWNER/MANAGER editam; STAFF read-only.

Arquivos: `src/app/painel/cardapio/{page.tsx,page.module.css}` +
`_components/{ProductForm,CategoryManager,ProductList}/` +
`src/features/cardapio/queries.ts`.

## Fase 2 — Pedidos (`/painel/pedidos`)

Núcleo operacional. Endpoints `/orders` (lista, OWNER/MANAGER),
`/orders/:id`, `PATCH /orders/:id/status`.

- Rota `src/app/painel/pedidos/page.tsx`: lista com filtro por status
  (`Tabs` ou `Select`), colunas cliente/itens/total/status/hora. Polling
  leve via `refetchInterval` do TanStack Query (pedidos mudam em tempo real).
- Detalhe do pedido: `Drawer`/`Dialog` com itens, endereço, histórico de
  status; botões de avanço de status (`pending → preparing → ready →
  dispatched → delivered`) via `useMutation` + invalidação.
- Atribuir courier: `Select`/`Combobox` populado por
  `GET /courier-tenants/tenant/:tenantId` (se a vinculação ao pedido existir
  na API; senão, fica como sub-fase).
- Permissão: STAFF vê/atualiza, mas a **lista geral** é OWNER/MANAGER — ajustar
  a tela conforme papel.

Arquivos: `src/app/painel/pedidos/{page.tsx,page.module.css}` +
`_components/{OrderList,OrderDetail,StatusStepper,CourierPicker}/` +
`src/features/pedidos/queries.ts`.

## Fase 3 — Configurações da loja (`/painel/configuracoes`)

Restrito a TENANT_OWNER. Endpoints sob `/tenants/:tenantId/...`.

- Rota com seções (DS `Tabs`):
  - **Dados da loja**: `PATCH /tenants/:id` (nome, logo, cores, endereço).
  - **Horários**: `opening-hours` CRUD (7 dias, `dayOfWeek` 0–6, `Switch`
    aberto/fechado + `DatePicker`/time inputs).
  - **Pagamentos**: `tenant-payment-method` (toggle PIX/CARD/CASH).
  - **Operação**: `tenant-settings` (PUT upsert) — taxa de entrega,
    pedido mínimo, fidelidade, exigir conta/CPF, delivery/retirada.
  - **Telefones**: `tenant-phone` CRUD.
- Permissão: esconder a rota para MANAGER/STAFF (gate 0.4).

Arquivos: `src/app/painel/configuracoes/{page.tsx,page.module.css}` +
`_components/{StoreInfoForm,OpeningHoursEditor,PaymentMethodsForm,
OperationSettingsForm,PhonesEditor}/` + `src/features/configuracoes/queries.ts`.

## Fase 4 — Colaboradores (`/painel/colaboradores`)

⚠️ **Depende de backend não implementado** (módulo Invite). Estratégia:

- **Já dá para fazer hoje** (endpoints existentes):
  - Listar equipe: `GET /user-tenants/tenant/:tenantId` (OWNER/MANAGER).
  - Remover membro: `DELETE /user-tenants/:userId/:tenantId`.
  - Tela de roster com papel (`Badge`) e ação de remover (respeitando a
    hierarquia de quem pode remover quem).
- **Bloqueado até o backend**: enviar **convite** por e-mail
  (`Invite` + token + aceitação). Deixar a UI do botão "Convidar" preparada,
  mas sinalizar como pendente até a rota existir. **Pré-requisito: implementar
  o módulo Invite na `nino-api`** (fora do escopo deste app) — confirmar com
  o usuário se entra agora ou depois.

Arquivos: `src/app/painel/colaboradores/{page.tsx,page.module.css}` +
`_components/{TeamRoster,InviteDialog}/` + `src/features/colaboradores/queries.ts`.

## Fase 5 — Dashboard com dados reais (`/painel`)

- Trocar os `—` dos `StatCard` por dados derivados de `/orders` do dia
  (contagem, faturamento, ticket médio) via `useQuery`. Se a API não tiver
  endpoint de agregação, calcular no client a partir da lista de pedidos do
  dia (suficiente para MVP) — ou solicitar endpoint de métricas ao backend.

---

## Convenções a seguir (do CLAUDE.md / padrões do repo)

- Sem ponto-e-vírgula, aspas simples, máx **80 chars/linha**, sem `any`.
- Um componente por pasta: `Nome/{Nome.tsx, Nome.types.ts, index.ts}`;
  `type` (não `interface`), um type por arquivo kebab-case.
- Estilo: Tailwind primeiro; `.module.css` co-localizado só para layout/
  keyframes/pseudo, com `@reference "@nino/ds/globals.css"` e `@apply`.
  Classes Tailwind em constantes nomeadas, nunca inline gigante no className.
- Imports ordenados (React → libs → `@nino/*` → relativos).
- Reusar DS (`@nino/ds`) e tipos/http de `@nino/lib`; nunca recriar.
- Gitflow: branch sai de `develop`; rodar lint antes do push.

## Arquivos-chave de referência (reuso)

- HTTP: `packages/lib/src/services/http-client.ts`,
  `apps/manager/src/lib/http.ts` (`httpConfig`).
- Auth atual (modelo a seguir): `apps/manager/src/services/auth.service.ts`,
  `src/hooks/useAuthUser.ts`, `src/contexts/PainelAuth.tsx`,
  `src/app/painel/layout.tsx`.
- Tipos: `packages/lib/src/types/{product,order,tenant,user,courier}/`.
- DS: `packages/ds/src/components/` (Table, Dialog, Drawer, Tabs, Select,
  Switch, NumberInput, Badge, Toast, Skeleton, Stepper...).

## Verificação (end-to-end)

1. Subir API: `nino-api` em `localhost:3000` (docker-compose + seed).
2. `apps/manager` com `NEXT_PUBLIC_API_URL=http://localhost:3000`; `npm run dev`.
3. Fluxo: cadastrar OWNER → onboarding → confirmar que o painel resolve o
   `tenantId` (Fase 0.2) sem loop de loader.
4. Por área: criar produto/categoria e ver na lista; criar pedido (via app
   consumer ou guest-order) e avançar status no manager; editar horários/
   pagamentos/settings e reabrir para confirmar persistência; listar/remover
   um membro da equipe.
5. Validar gate de permissões logando como MANAGER e STAFF (sidebar e ações
   restritas).
6. `npm run lint` + checagem de 80 chars antes de push.

## Pergunta em aberto

- **Módulo Invite na `nino-api`**: implementar agora (desbloqueia o convite em
  Colaboradores) ou entregar a Fase 4 só com roster/remoção e o convite depois?
