/**
 * How the panel groups the queue: by what the store does next.
 *
 * `confirmed` e `kitchen` são etapas diferentes de propósito. Confirmar é
 * dizer "eu aceito fazer"; começar a preparar é ocupar a chapa. Entre uma
 * coisa e outra existe fila — e enquanto as duas moravam no mesmo balde,
 * ninguém sabia o que já estava no fogo e o que só estava prometido.
 */
export type OrderStage =
  | 'incoming'
  | 'confirmed'
  | 'kitchen'
  | 'street'
  | 'counter'
  | 'closed'
