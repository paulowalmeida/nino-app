import { DashboardTab } from "@demo/_tabs/dashboard/DashboardTab"
import { OrderTab } from "@demo/_tabs/order/OrderTab"
import { DemoTab } from "@demo/_tabs/tab.type"
import { TrackingTab } from "@demo/_tabs/tracking/TrackingTab"

export const tabs = [
  { id: "order", label: "🛒 Fazer pedido", Component: OrderTab },
  { id: "tracking", label: "📍 Acompanhar", Component: TrackingTab },
  { id: "dashboard", label: "📊 Dashboard", Component: DashboardTab },
] as const satisfies readonly DemoTab[]

export type TabId = (typeof tabs)[number]["id"]
