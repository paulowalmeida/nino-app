import { BenefitItem } from "@for-restaurants/_components/benefit-item/BenefitItem"
import { BillingRow } from "@for-restaurants/_components/billing-row/BillingRow"

import { benefits, billing } from "./forRestaurants.constants"
import styles from "./ForRestaurants.module.css"

export function ForRestaurants() {
  return (
    <section id="para-restaurantes" className={styles.section}>
      <div className={styles.inner}>
        <div>
          <span className={styles.eyebrow}>O Nino vs o mercado</span>

          <h2 className={styles.title}>
            Mais completo.{" "}
            <span className={styles.titleAccent}>Mais justo.</span>
          </h2>

          <p className={styles.lead}>
            Os outros cobram por pedido, por loja extra ou uma fatia do seu
            faturamento. No Nino a mensalidade é fixa por plano — com app, site,
            WhatsApp e os seus entregadores no mesmo pacote.
          </p>

          <div className={styles.list}>
            {benefits.map((text) => (
              <BenefitItem key={text} text={text} />
            ))}
          </div>
        </div>

        <div className={styles.comparisonCard}>
          <div className={styles.comparisonHead}>
            <span>Plataforma</span>

            <span>Como cobram</span>
          </div>
          {billing.map((item) => (
            <BillingRow key={item.name} {...item} />
          ))}

          <BillingRow name="Nino" model="Fixo · Sem comissão" isNino />
        </div>
      </div>
    </section>
  )
}
