"use client"

import { useState } from "react"

import { DashboardTab } from "@demo/_tabs/dashboard/DashboardTab"
import { OrderTab } from "@demo/_tabs/order/OrderTab"
import { DemoTab } from "@demo/_tabs/tab.type"
import { TrackingTab } from "@demo/_tabs/tracking/TrackingTab"

import styles from "./Demo.module.css"

export function Demo() {
  const tabs: DemoTab[] = [
    { id: "order", label: "🛒 Fazer pedido", Component: OrderTab },
    { id: "tracking", label: "📍 Acompanhar", Component: TrackingTab },
    { id: "dashboard", label: "📊 Dashboard", Component: DashboardTab },
  ]

  type TabId = (typeof tabs)[number]["id"]

  const [active, setActive] = useState<TabId>("order")

  const ActiveTab = tabs.find((t) => t.id === active)!.Component

  const tabStyle = (tab: DemoTab) =>
    `${styles.tab}${active === tab.id ? ` ${styles.tabActive}` : ""}`

  return (
    <section id="demo" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>Como fica o seu delivery</h2>

          <p>Tudo que seu cliente vê — na palma da mão, com a sua marca.</p>
        </div>

        <div className={styles.tabGroup}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={tabStyle(tab)}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.mockup}>
          <ActiveTab />
        </div>
      </div>
    </section>
  )
}
