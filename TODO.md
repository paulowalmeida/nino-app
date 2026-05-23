# TODO — nino-app

Lista de itens pendentes sem ordem de prioridade.

## @nino/lib

- [x] Interfaces e enums gerados a partir dos DTOs/types do backend
- [ ] API client — funções tipadas por endpoint (fetch/axios + base URL + auth headers)
- [ ] React hooks — `useProducts`, `useOrder`, etc. (opcional, pode ficar nos apps)

## @nino/ui

- [ ] Setup inicial — Radix UI + tokens CSS para white-label
- [ ] Componentes base — Button, Input, Modal, Toast, etc.

## nino-consumer

- [ ] Setup inicial — Next.js SSR + @nino/lib + @nino/ui
- [ ] Browse público — listagem de produtos por tenant (sem login)
- [ ] Fluxo guest — pedido sem conta (nome + telefone + endereço + itens)
- [ ] Auth — login OAuth (Google, Facebook, email)
- [ ] Completar perfil — CPF + telefone → vira CUSTOMER
- [ ] Endereços — cadastro com suporte a geolocalização
- [ ] Métodos de pagamento — cadastro via gateway token
- [ ] Histórico de pedidos
- [ ] Programa de fidelidade — saldo e extrato por loja
- [ ] Preferências de notificação

## nino-manager

- [ ] Setup inicial — Next.js + @nino/lib + @nino/ui
- [ ] Auth — login OWNER / MANAGER / STAFF
- [ ] Seleção de loja (multi-tenant)
- [ ] Cardápio — categorias e produtos (CRUD)
- [ ] Pedidos — listagem, atualização de status, atribuição de entregador
- [ ] Configurações da loja — TenantSettings, horários, métodos de pagamento
- [ ] Convites — convidar colaboradores e entregadores

## nino-courier

- [ ] Setup inicial — Next.js + @nino/lib + @nino/ui
- [ ] Auth — login COURIER
- [ ] Minhas lojas — tenants vinculados
- [ ] Pedidos atribuídos — listagem e detalhes
- [ ] Fluxo de entrega — saiu para entrega → entregue / cancelado
- [ ] Histórico de entregas

## nino-backoffice

- [ ] Setup inicial — Next.js + @nino/lib + @nino/ui
- [ ] Auth — login ADMIN / SUPPORT
- [ ] Gestão de planos e tipos
- [ ] Gestão de empresas e assinaturas
- [ ] Gestão de tenants
- [ ] Gestão de usuários
- [ ] Listagem global de pedidos

## Tooling / DX

- [ ] Claude Code hook (`PostToolUse`) — detecta modificação em componente/type e lembra de revisar docs e @nino/lib
- [ ] Geração automática de API client a partir das interfaces do @nino/lib
