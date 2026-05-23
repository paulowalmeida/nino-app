# Perfis — Backoffice Nino

## GlobalRole

### ADMIN
Criado diretamente via banco de dados. Sem fluxo de cadastro público. Controle total da plataforma.

### SUPPORT
Convidado por link de email pelo ADMIN. Fluxo: rota pública do invite → entra como GUEST → preenche cadastro → acesso ao backoffice com restrição de dados sensíveis. Depende de: invite + Resend.

### MERCHANT
Rota pública de cadastro. O sistema cria atomicamente: `Company` + `CompanyResponsible` + `User` + `Credential` + `Subscription`. Trial de 30 dias sem cartão.

Acesso total ao backoffice de todos os seus tenants. Em lojas sem equipe, opera sozinho todo o fluxo (pedidos, cardápio, configurações, entregas). Quando tem equipe, convida colaboradores definindo o perfil.

- Plano com tenant único → entra direto na visão da loja
- Planos com múltiplos tenants → tela de seleção de loja

**Pode convidar:** OWNER, MANAGER, STAFF

---

## Hierarquia de convites e remoção

| Quem | Pode convidar | Pode remover |
|---|---|---|
| MERCHANT | OWNER, MANAGER, STAFF | OWNER, MANAGER, STAFF |
| OWNER | MANAGER, STAFF | MANAGER, STAFF |
| MANAGER | STAFF | STAFF |
| STAFF | — | — |

Remoção segue a mesma hierarquia do convite — apenas níveis acima podem remover.
