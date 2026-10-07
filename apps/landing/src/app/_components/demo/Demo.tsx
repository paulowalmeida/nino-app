"use client"

import { useState } from "react"

import { DemoTab } from "@demo/_tabs/tab.type"
import { type TabId, tabs } from "@demo/demo-tabs"

import styles from "./Demo.module.css"

export function Demo() {
  const [active, setActive] = useState<TabId>("order")

  const current = tabs.find((t) => t.id === active)!
  const ActiveTab = current.Component
  const isOwner = current.side === "owner"

  const tabStyle = (tab: DemoTab) =>
    `${styles.demoTab}${active === tab.id ? ` ${styles.tabActive}` : ""}`

  const mockupStyle = `${styles.mockup}${
    isOwner ? ` ${styles.mockupOwner}` : ""
  }`

  return (
    <section id="demo" className={styles.demoSection}>
      <div className={styles.demoInner}>
        <div className={styles.demoHeader}>
          <span className={styles.eyebrow}>Os dois lados do balcão</span>

          <h2 className={styles.demoTitle}>
            O que seu cliente vê,{" "}
            <span className={styles.titleAccent}>e o que você vê</span>
          </h2>

          <p className={styles.lead}>
            O mesmo pedido, do celular de quem pede ao painel de quem cozinha.
          </p>
        </div>

        <div className={styles.tabGroup} role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active === tab.id}
              className={tabStyle(tab)}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className={styles.demoCaption}>{current.caption}</p>

        <div className={mockupStyle}>
          <div className={styles.chrome}>
            <span className={styles.chromeLabel}>
              {isOwner ? "Painel do Nino" : "Celular do cliente"}
            </span>

            <span className={styles.chromeMeta} aria-hidden="true">
              {isOwner ? "burgaodoze.nino.delivery" : "18h22 · 4G"}
            </span>
          </div>

          <div className={styles.screen}>
            <ActiveTab />
          </div>
        </div>
      </div>
    </section>
  )
}
