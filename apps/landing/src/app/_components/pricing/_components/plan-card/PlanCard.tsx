import { Fragment } from "react"

import type { PlanCardProps } from "./PlanCard.types"
import styles from "./PlanCard.module.css"

import { CADASTRO_URL } from "@/config"

export function PlanCard({
  tag,
  price,
  period,
  small,
  desc,
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

      <p className={styles.description}>{desc}</p>

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
