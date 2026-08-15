import { StepCard } from "@how-it-works/_components/step-card/StepCard"

import { steps } from "./howItWorks.constants"
import styles from "./HowItWorks.module.css"
import { Eyebrow } from "@ds/components/Eyebrow/Eyebrow"

export function HowItWorks() {
  return (
    <section id="como-funciona" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Como o Nino funciona</h2>

          <p className={styles.subtitle}>
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
