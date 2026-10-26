import { PlanCard } from "@pricing/_components/plan-card/PlanCard"

import { plans } from "./pricing.constants"
import styles from "./Pricing.module.css"

export function Pricing() {
  return (
    <section id="precos" className={styles.pricingSection}>
      <div className={styles.pricingInner}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Planos e preços</span>

          <h2 className={styles.pricingTitle}>Preço simples, resultado real</h2>

          <p className={styles.lead}>
            Sem taxa por pedido. Sem percentual sobre venda. Sem letras miúdas.
          </p>
        </div>

        <div className={styles.pricingGrid}>
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
