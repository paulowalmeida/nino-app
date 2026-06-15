import type { ReactNode } from "react"

import { NinoLogo } from "@components/NinoLogo"

import { NinoMascot } from "./_components/NinoMascot"
import styles from "./layout.module.css"

const brandPanel = `${styles.brandPanel} ${styles.dotGrid} ${styles.grain}`
const glowTop = `${styles.glowTop} ${styles.glowPulse}`
const mascot = `${styles.mascot} ${styles.mascotFloat}`
const mobileMascot = `${styles.mobileMascot} ${styles.mascotFloat}`
const formPanel = `${styles.formPanel} ${styles.warmBackdrop} ${styles.grain}`

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={brandPanel}>
        <div className={glowTop} />
        <div className={styles.glowBottom} />

        <div className={styles.brandLogo}>
          <NinoLogo tone="light" />
        </div>

        <div className={styles.mascotWrap}>
          <div className={styles.mascotStage}>
            <div className={styles.mascotHalo} />
            <NinoMascot className={mascot} />
          </div>
        </div>

        <div className={styles.tagline}>
          <h2 className={styles.taglineTitle}>
            Gerencie sua loja,
            <br />
            <span className={styles.highlight}>do seu jeito.</span>
          </h2>
          <p className={styles.taglineText}>
            Pedidos, cardápio, vendas e faturamento — tudo num só lugar.
          </p>
        </div>
      </aside>

      <main className={formPanel}>
        <div className={styles.formGlow} />
        <div className={styles.formInner}>
          <div className={styles.mobileBrand}>
            <NinoLogo
              size="md"
              mark={<NinoMascot className={mobileMascot} />}
            />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
