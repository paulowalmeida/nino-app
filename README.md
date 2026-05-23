# Nino Delivery — nino-app

## Sumário

* [1. Visão Geral](#1-visão-geral)
* [2. Arquitetura do Monorepo](#2-arquitetura-do-monorepo)
* [3. Stack](#3-stack)
* [4. Estrutura de Pastas](#4-estrutura-de-pastas)
* [5. Apps](#5-apps)
* [6. Packages](#6-packages)
* [7. Status](#7-status)
* [8. Roadmap](#8-roadmap)
* [9. Variáveis de Ambiente](#9-variáveis-de-ambiente)
* [10. Desenvolvimento Local](#10-desenvolvimento-local)
* [11. Contribuição & Commits](#11-contribuição--commits)

---

## 1. Visão Geral

Frontend do **Nino Delivery** — plataforma SaaS White-Label B2B para o mercado de alimentação. O consumidor final nunca vê a marca "Nino": cada loja tem sua identidade visual própria (`primaryColor`, `secondaryColor`, `logoUrl`, `customDomain`).

O monorepo agrupa os quatro apps Next.js e os dois packages compartilhados. Cada app atende um perfil de usuário específico e consome a `nino-api` via `@nino/lib`.

> Backend: [`nino-api`](https://github.com/paulowalmeida/nino-api)

---

## 2. Arquitetura do Monorepo

Gerenciado com **Turborepo** + **npm workspaces**. Cada app e package é um workspace independente com seu próprio `package.json` e `tsconfig.json`.

```
nino-app/
├── apps/          # Quatro apps Next.js (um por perfil de usuário)
└── packages/      # Packages compartilhados entre os apps
```

### Fluxo de dependências

```
nino-consumer  ──┐
nino-manager   ──┤──→ @nino/ui ──→ @nino/lib
nino-courier   ──┤──→ @nino/lib
nino-backoffice──┘
```

`@nino/lib` é a camada de contrato com a API — interfaces TypeScript e enums gerados a partir dos DTOs do backend. Nenhum app define seus próprios tipos de API.

---

## 3. Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router, SSR) |
| Linguagem | TypeScript 5.7 |
| UI base | Radix UI + tokens CSS (white-label) |
| Monorepo | Turborepo v2 + npm workspaces |
| Linting | ESLint + Prettier |
| Infra (produção) | Fly.io — shared-cpu-1x, 256MB ~$2–3/app |

---

## 4. Estrutura de Pastas

```text
nino-app/
├── apps/
│   ├── consumer/               # App do consumidor final
│   │   ├── docs/               # Regras de negócio do consumidor
│   │   └── src/app/
│   ├── manager/                # App do gestor da loja
│   │   ├── docs/               # Perfis OWNER / MANAGER / STAFF
│   │   └── src/app/
│   ├── courier/                # App do entregador
│   │   ├── docs/               # Regras do courier
│   │   └── src/app/
│   └── backoffice/             # App administrativo Nino
│       ├── docs/               # Subscription, planos, profiles ADMIN/SUPPORT
│       └── src/app/
├── packages/
│   ├── lib/
│   │   └── src/
│   │       ├── enums.ts        # GlobalRole, OrderStatus, etc.
│   │       ├── types/          # Interfaces por domínio
│   │       └── index.ts
│   └── ui/
│       └── src/
│           ├── components/     # Componentes base
│           └── index.ts
├── package.json
├── turbo.json
└── tsconfig.json
```

---

## 5. Apps

### `nino-consumer`

App do consumidor final. Suporta dois modos:

**Sem conta (guest):** navega o cardápio → informa nome + telefone + endereço → faz pedido via `POST /orders/guest`. Sem login, sem cadastro obrigatório.

**Com conta:** OAuth → completa perfil → acessa histórico, fidelidade, endereços salvos e métodos de pagamento.

Acessa: `GET /tenants/slug/:slug` · `GET /tenants/:id/products` · `POST /orders/guest` · `POST /orders` · rotas de customer autenticadas.

### `nino-manager`

App do gestor da loja. Perfis: `OWNER`, `MANAGER`, `STAFF`.

Funcionalidades por perfil:

| Funcionalidade | OWNER | MANAGER | STAFF |
|---|:---:|:---:|:---:|
| Cardápio (CRUD) | ✓ | ✓ | — |
| Pedidos | ✓ | ✓ | ✓ |
| Configurações da loja | ✓ | — | — |
| Financeiro | ✓ | — | — |
| Convidar colaboradores | ✓ | ✓* | — |

> *MANAGER pode convidar apenas STAFF

### `nino-courier`

App do entregador autônomo. Acesso restrito a pedidos atribuídos, rota de entrega e histórico próprio.

Fluxo: login → pedidos atribuídos → saiu para entrega → entregue / cancelado.

### `nino-backoffice`

App administrativo da plataforma Nino. Perfis: `ADMIN`, `SUPPORT`.

Gerencia empresas, planos, assinaturas, tenants, usuários e tem visibilidade global de pedidos. `SUPPORT` tem restrição de dados sensíveis.

---

## 6. Packages

### `@nino/lib`

Contrato tipado entre os apps e a `nino-api`. Não tem dependências de runtime — TypeScript puro.

```
packages/lib/src/
├── enums.ts          # GlobalRole, TenantRole, OrderStatus, PaymentMethod, ...
└── types/
    ├── auth.ts        # LoginRequest, RegisterRequest, LoginResponse, Tokens
    ├── user.ts        # User, CredentialInfo, UserTenant, CreateUserRequest
    ├── tenant.ts      # Tenant, TenantSettings, OpeningHours, TenantPhone, ...
    ├── product.ts     # Product, ProductCategory, CreateProductRequest, ...
    ├── order.ts       # Order, OrderItem, CreateGuestOrderRequest, ...
    ├── customer.ts    # Customer, CustomerAddress, LoyaltyTransaction, ...
    ├── company.ts     # Company, CompanyResponsible, ...
    ├── subscription.ts
    ├── plan.ts
    ├── courier.ts
    └── common.ts      # PaginatedResponse, PaginationMeta, PaginatedQuery
```

### `@nino/ui`

Componentes base com Radix UI e tokens CSS para white-label. Ainda não implementado — ver TODO.

---

## 7. Status

**Última atualização:** Maio 2026 · **Desenvolvedor:** Paulo (Solo)

| Item | Status |
|---|---|
| `@nino/lib` — interfaces e enums | ✅ |
| `@nino/ui` — componentes base | ⏳ |
| `nino-consumer` | ⏳ |
| `nino-manager` | ⏳ |
| `nino-courier` | ⏳ |
| `nino-backoffice` | ⏳ |

---

## 8. Roadmap

### Curto prazo

- [ ] `@nino/lib` — API client (funções tipadas por endpoint)
- [ ] `@nino/ui` — setup inicial com Radix UI e tokens CSS

### Médio prazo

- [ ] `nino-consumer` — browse público + fluxo guest + auth
- [ ] `nino-manager` — gestão de cardápio e pedidos

### Longo prazo

- [ ] `nino-courier` — fluxo de entrega
- [ ] `nino-backoffice` — gestão de plataforma

---

## 9. Variáveis de Ambiente

Cada app tem seu próprio `.env.local` baseado no `.env.example` da pasta do app.

```env
# URL da API (nino-api)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Ambiente
NODE_ENV=development
```

---

## 10. Desenvolvimento Local

```bash
# Instalar dependências (raiz do monorepo)
npm install

# Rodar todos os apps em paralelo
npm run dev

# Rodar um app específico
cd apps/consumer && npm run dev

# Type check de todos os packages e apps
npm run type-check

# Lint
npm run lint
```

Cada app roda em uma porta diferente:

| App | Porta |
|---|---|
| nino-consumer | 3001 |
| nino-manager | 3002 |
| nino-courier | 3003 |
| nino-backoffice | 3004 |

---

## 11. Contribuição & Commits

### Branches

- `main` → Produção
- `feat/NAPP-XX` → Features (incremental, ex: feat/NAPP-01)

### Padrão de Commits

```
feat(consumer): implementar fluxo de pedido guest
fix(ui): corrigir responsividade do card de produto
chore(lib): atualizar interfaces de order
refactor(manager): extrair hook de listagem de pedidos
```
