import { Fragment } from "react"

import styles from "./PlanCard.module.css"
import type { PlanCardProps } from "./PlanCard.types"

import { CADASTRO_URL } from "@/config"

export function PlanCard({
  tag,
  price,
  period,
  small,
  desc,
  inherits,
  features,
  cta,
  featured,
}: PlanCardProps) {
  return (
    <div className={`${styles.plan}${featured ? ` ${styles.featured}` : ""}`}>
      {featured && <span className={styles.popularBadge}>MAIS POPULAR</span>}

      <p className={styles.planName}>{tag}</p>

      <div className={`${styles.price}${small ? ` ${styles.priceSmall}` : ""}`}>
        {price.split("\n").map((line, i) => (
          <Fragment key={line}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
        {period && <span className={styles.period}>{period}</span>}
      </div>

      <p className={styles.planCardDescription}>{desc}</p>

      {inherits && (
        <p className={styles.inherits}>
          <span aria-hidden="true" className={styles.inheritsMark}>
            ↳
          </span>
          {inherits}
        </p>
      )}

      <div className={styles.featureList}>
        {features.map((f) => (
          <span key={f} className={styles.featureItem}>
            {f}
          </span>
        ))}
      </div>

      <a className={styles.ctaButton} href={CADASTRO_URL}>
        {cta}
      </a>
    </div>
  )
}
