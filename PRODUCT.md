# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clientes de restaurantes que montam e finalizam pedidos pelo celular ou desktop; gestores configuram cada unidade e sua identidade.

## Product Purpose

O Nino conecta cardápio, checkout, acompanhamento e operação do restaurante. No checkout, sucesso significa concluir um pedido correto com pouco atrito e sem surpresa de preço, entrega ou pagamento.

## Operating Context

O cliente normalmente compra com pressa e uma mão no celular. Pode pedir como visitante ou autenticado, por entrega ou retirada, com regras configuradas por unidade.

## Capabilities and Constraints

- React, TypeScript e design system `@nino/ds` no Consumer.
- Cores, marca, meios de pagamento, pedido mínimo e formatos de atendimento vêm da unidade.
- O checkout deve manter validação, carrinho, cotação de entrega e criação do pedido existentes.

## Brand Commitments

Cada restaurante escolhe sua própria paleta e ativos. O Consumer deve aplicar essa identidade sem perder contraste, legibilidade ou a linguagem funcional do Nino.

## Evidence on Hand

Implementação e dados reais locais em `apps/consumer`; temas configuráveis em `apps/manager/src/pages/Units/constants/unit.constants.ts`. Não inventar avaliações, selos ou promessas comerciais.

## Product Principles

- A identidade da unidade aparece com clareza, sem disputar com a tarefa.
- O total e as condições do pedido permanecem visíveis antes da confirmação.
- Cada bloco pede uma única decisão e explica erros de forma acionável.
- Mobile é o cenário principal; desktop aproveita largura sem esticar formulários.

## Accessibility & Inclusion

Controles acessíveis por teclado, foco visível, contraste preservado e estados anunciados por tecnologias assistivas.
