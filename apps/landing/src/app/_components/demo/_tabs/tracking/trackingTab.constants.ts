export type StepStatus = "done" | "active" | "pending"

export const trackingSteps: Array<{
  icon: string
  label: string
  time: string
  status: StepStatus
}> = [
  {
    icon: "✓",
    label: "Pedido confirmado",
    time: "18h10 · Pagamento aprovado",
    status: "done",
  },
  {
    icon: "✓",
    label: "Em preparo",
    time: "18h15 · Restaurante aceitou",
    status: "done",
  },
  {
    icon: "🛵",
    label: "A caminho · ~13 min",
    time: "18h22 · Carlos pegou seu pedido",
    status: "active",
  },
  { icon: "✓", label: "Entregue", time: "Previsão 18h35", status: "pending" },
]
