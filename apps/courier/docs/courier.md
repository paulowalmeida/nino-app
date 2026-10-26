# Courier — Regras de Negócio

## Perfil

Autônomo independente, sem vínculo empregatício com a plataforma. Rota pública de cadastro próprio.

## Vínculo com units

Via `CourierUnit`: a loja envia invite por email/link, ou o responsável associa manualmente via backoffice. Um entregador pode estar vinculado a múltiplos units de diferentes merchants.

## Acesso

Restrito a:
- Pedidos atribuídos
- Rota de entrega
- Dados do cliente (para entrega)
- Confirmação/cancelamento de entrega
- Histórico próprio de entregas

## Fluxo operacional

A atribuição de pedidos é feita pela loja (MANAGER ou OWNER). O entregador recebe notificação e executa. A plataforma serve como canal operacional e de registro para auditoria entre entregador e restaurante.

Pagamento negociado diretamente com o restaurante — fora da plataforma.

## Status de entrega

| Ação | Quem |
|---|---|
| Atribuir pedido ao entregador | MANAGER ou OWNER |
| Marcar como saiu para entrega | COURIER |
| Confirmar entrega | COURIER |
| Cancelar entrega | COURIER |
