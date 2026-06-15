# Tour guiado do backend (nino-api)

Plano de onboarding em pílulas curtas (~10–15 min cada) para dominar o
backend sem cair em débito cognitivo. Consuma na ordem, quando tiver
disposição. Cada pílula: **o que faz · por que assim · arquivo pra abrir e
ler junto**. Os caminhos são relativos a `nino-api/`.

> Objetivo: entender o suficiente para implementar a Fase 0 do manager com
> segurança (a resolução de tenant é o gap que mais trava o app hoje).

---

## Pílula 1 — Auth e sessão

**O que faz:** login por e-mail/senha, emissão de access token (15 min) +
refresh token (7 dias), `/auth/me`, logout e rotação de refresh.

**Por que assim:** access token curto reduz janela de risco; refresh longo
evita relogin constante. A reutilização de refresh é detectada e bloqueada
(segurança). O `Company.isActive` funciona como chave-mestra: desligou,
invalida os tokens.

**Abrir:**
- `src/modules/auth/auth.controller.ts` — rotas (`login`, `register`,
  `refresh`, `logout`, `me`).
- `src/modules/auth/auth.service.ts` — lógica; repare nos
  `UnauthorizedException('Invalid credentials')` (ligados ao card NMAG-183).
- `src/modules/auth/dtos/login-request.dto.ts` e `register-request.dto.ts`
  — a divergência de política de senha (8–16 vs min 6) é o card NAPI-1.

---

## Pílula 2 — Onboarding (Company · Subscription · Tenant)

**O que faz:** depois do `register` (GLOBAL_OWNER), o `POST /onboarding` cria
atomicamente Company + CompanyResponsible + Subscription (TRIAL 30d) +
primeiro Tenant.

**Por que assim:** o lojista entra em trial sem pagamento; tudo numa
transação para não deixar estado pela metade. É o passo que tira o tenant do
status CONFIGURING.

**Abrir:**
- `src/modules/onboarding/onboarding.controller.ts` e o service.
- `src/modules/onboarding/dtos/complete-onboarding.dto.ts` — repare nos
  validadores `@IsCpf()` / `@IsCnpj()` (existem no backend; o front ainda não
  valida — cards NDS-1 / NMAG-180).
- `docs/profiles.md` — quem é GLOBAL_OWNER vs TENANT_OWNER.

> Gap-chave do manager: o `OnboardingResponse` devolve company + subscription,
> mas **não** o tenant; e `me()` não traz tenant. É por isso que a Fase 0
> precisa resolver o tenant via `/user-tenants/user/:userId`.

---

## Pílula 3 — Modelo escopado por tenant (multi-tenant)

**O que faz:** quase tudo (produtos, pedidos, settings, horários) é filtrado
por `tenantId`. O acesso de uma pessoa a uma loja é o `UserTenant`
(userId + tenantId + TenantRole OWNER/MANAGER/STAFF).

**Por que assim:** uma Company pode ter vários Tenants (lojas), e uma pessoa
pode pertencer a mais de uma com papéis diferentes. O `isCurrent` marca a
loja ativa no workspace.

**Abrir:**
- `prisma/schema.prisma` — entidades Tenant, UserTenant, e como `tenantId`
  amarra produtos/pedidos.
- `src/modules/user/modules/user-tenant/user-tenant.controller.ts` — as rotas
  que o manager vai usar para resolver o tenant e listar/gerir a equipe.
- `docs/database.md` e `docs/architecture.md` — visão geral.

---

## Pílula 4 — Produtos e pedidos

**O que faz:** CRUD de produtos/categorias por tenant e o ciclo de vida do
pedido (pending → preparing → ready → dispatched → delivered) com histórico de
status.

**Por que assim:** preço é "congelado" no item do pedido (unitPrice no
momento da compra); limites de plano (maxProducts/maxOrders) são validados na
criação. Pedido pode ser de Customer logado ou guest.

**Abrir:**
- `src/modules/product/product.controller.ts` e
  `.../product-category/...` — base das telas do Cardápio (Fase 1).
- `src/modules/order/order.controller.ts` e `guest-order.controller.ts` —
  base da tela de Pedidos (Fase 2); repare no `PATCH /orders/:id/status`.

---

## Como usar este tour
Peça ao Claude "manda a pílula N" quando quiser a versão explicada e
conversada (com analogias React/Next, já que é seu forte). Este arquivo é só
o índice/roteiro.
