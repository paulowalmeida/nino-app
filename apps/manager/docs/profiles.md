# Perfis — Manager / Backoffice da Loja

Todos os perfis abaixo são scoped por tenant via `UserTenant` — o acesso é sempre restrito à loja vinculada. Um colaborador pode ter vínculo em múltiplas lojas, mas nunca mistura visão entre elas.

## TenantRole

### OWNER
Dono de uma loja específica. Pode ser o próprio MERCHANT ou alguém delegado via invite. Acesso total à unidade: operação, configurações e financeiro da loja — nunca da empresa como um todo.

**Pode convidar:** MANAGER, STAFF

### MANAGER
Gerente operacional de uma loja. Acesso ao dia a dia da operação sem controle financeiro ou de configurações da unidade.

**Pode convidar:** STAFF

### STAFF
Colaborador operacional genérico. Cobre qualquer função de execução (atendimento, cozinha, etc.). Sem acesso a configurações ou financeiro.

---

## Hierarquia de convites e remoção

| Quem | Pode convidar | Pode remover |
|---|---|---|
| OWNER | MANAGER, STAFF | MANAGER, STAFF |
| MANAGER | STAFF | STAFF |
| STAFF | — | — |

Remoção segue a mesma hierarquia do convite — apenas níveis acima podem remover.

---

## Entidades de vínculo

| Vínculo | Entidade |
|---|---|
| Usuário ↔ Tenant | `UserTenant` (inclui TenantRole) |
| Entregador ↔ Tenant | `CourierTenant` (sem role, vínculo operacional simples) |
