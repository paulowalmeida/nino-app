import { StepCard } from "@how-it-works/_components/step-card/StepCard"

import { steps } from "./howItWorks.constants"
import styles from "./HowItWorks.module.css"

export function HowItWorks() {
  return (
    <section id="como-funciona" className={styles.howItWorksSection}>
      <div className={styles.howItWorksInner}>
        <div className={styles.howItWorksHeader}>
          <span className={styles.eyebrow}>Simples assim</span>

          <h2 className={styles.howItWorksTitle}>Como o Nino funciona</h2>

          <p className={styles.howItWorksSubtitle}>
            Do cadastro ao primeiro pedido em 3 passos.
          </p>
        </div>

        <div className={styles.track}>
          {steps.map((step, index) => (
            <StepCard key={step.title} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
