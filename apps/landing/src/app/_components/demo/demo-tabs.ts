import { CounterTab } from "@demo/_tabs/counter/CounterTab"
import { OrderTab } from "@demo/_tabs/order/OrderTab"
import { DemoTab } from "@demo/_tabs/tab.type"
import { TrackingTab } from "@demo/_tabs/tracking/TrackingTab"

export const tabs = [
  {
    id: "order",
    label: "🛒 Fazer o pedido",
    side: "consumer",
    caption:
      "A loja que seu cliente abre pelo link — cardápio com foto, sem app pra baixar.",
    Component: OrderTab,
  },
  {
    id: "tracking",
    label: "🔔 Acompanhar",
    side: "consumer",
    caption:
      "Cada mudança de status vira aviso no WhatsApp, sem ninguém parar pra digitar.",
    Component: TrackingTab,
  },
  {
    id: "counter",
    label: "🧑‍🍳 No balcão",
    side: "owner",
    caption:
      "A fila da loja como ela aparece no painel do Nino — a tela que você abre no domingo à noite.",
    Component: CounterTab,
  },
] as const satisfies readonly DemoTab[]

export type TabId = (typeof tabs)[number]["id"]
