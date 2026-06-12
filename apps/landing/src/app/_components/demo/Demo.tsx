"use client"

import { useState } from "react"

import { DemoTab } from "@demo/_tabs/tab.type"
import { type TabId,tabs } from "@demo/demo-tabs"

import styles from "./Demo.module.css"

export function Demo() {
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
