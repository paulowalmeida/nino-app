export const queueTiles = [
  { value: "2", label: "esperando aceite", urgent: true },
  { value: "5", label: "na cozinha", urgent: false },
  { value: "3", label: "saíram para entrega", urgent: false },
  { value: "1", label: "pronto para retirada", urgent: false },
]

export const queueOrders = [
  {
    code: "#1042",
    consumer: "João Silva",
    items: "1 Combo Família · entrega",
    total: "R$ 69,90",
    status: "Esperando aceite",
    tone: "waiting" as const,
    trail: "chegou pelo WhatsApp há 2 min",
  },
  {
    code: "#1041",
    consumer: "Maria Costa",
    items: "1 Pizza Margherita · entrega",
    total: "R$ 42,00",
    status: "Na cozinha",
    tone: "kitchen" as const,
    trail: "aceito por Ana às 18h12",
  },
  {
    code: "#1039",
    consumer: "Pedro Melo",
    items: "2 X-Burgão · retirada",
    total: "R$ 57,80",
    status: "Pronto para retirada",
    tone: "pickup" as const,
    trail: "preparado por Ana às 18h05",
  },
  {
    code: "#1038",
    consumer: "Lucia Ramos",
    items: "1 Smash Clássico · entrega",
    total: "R$ 24,90",
    status: "Saiu para entrega",
    tone: "delivery" as const,
    trail: "com Carlos desde 18h02",
  },
]
