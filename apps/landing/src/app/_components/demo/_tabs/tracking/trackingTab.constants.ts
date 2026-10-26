export type StepStatus = "done" | "active" | "pending"

export const trackingSteps: Array<{
  icon: string
  label: string
  time: string
  status: StepStatus
}> = [
  {
    icon: "✓",
    label: "Pedido recebido",
    time: "18h10 · pago no Pix, antes de sair da cozinha",
    status: "done",
  },
  {
    icon: "✓",
    label: "Aceito pela loja",
    time: "18h12 · Ana confirmou",
    status: "done",
  },
  {
    icon: "🍳",
    label: "Em preparo",
    time: "18h15 · sai para entrega por volta das 18h30",
    status: "active",
  },
  {
    icon: "🛵",
    label: "Saiu para entrega",
    time: "com Carlos, entregador da loja",
    status: "pending",
  },
  { icon: "✓", label: "Entregue", time: "previsão 18h40", status: "pending" },
]

export const notifications = [
  {
    time: "18h10",
    text: "Oi, João! Recebemos seu pedido #1042 e o pagamento caiu. Já vamos preparar 🍔",
  },
  {
    time: "18h12",
    text: "Pedido aceito. Fica pronto por volta das 18h30 — a gente avisa quando sair.",
  },
]
