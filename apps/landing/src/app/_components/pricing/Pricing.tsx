import { PlanCard } from "@pricing/_components/plan-card/PlanCard"

import { plans } from "./pricing.constants"
import styles from "./Pricing.module.css"
import { Eyebrow } from "@ds/components/Eyebrow/Eyebrow"

export function Pricing() {
  return (
    <section id="precos" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <Eyebrow>Planos e preços</Eyebrow>

          <h2 className={styles.title}>Preço simples, resultado real</h2>

          <p className={styles.lead}>
            Sem taxa por pedido. Sem percentual sobre venda. Sem letras miúdas.
          </p>
        </div>

        <div className={styles.grid}>
          {plans.map((plan) => (
            <PlanCard key={plan.tag} {...plan} />
          ))}
        </div>

        <p className={styles.fine}>
          🔒 30 dias grátis no plano Pro. Sem cartão de crédito.
        </p>
      </div>
    </section>
  )
}
