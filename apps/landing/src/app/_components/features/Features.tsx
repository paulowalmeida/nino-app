import { Eyebrow } from "@nino/ds/components/Eyebrow"

import { FeatureCard } from "@features/_components/feature-card/FeatureCard"

import { features } from "./features.constants"
import styles from "./Features.module.css"

export function Features() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Tudo que você precisa,{" "}
            <span className={styles.titleAccent}>nada que te atrapalha</span>
          </h2>

          <p className={styles.subtitle}>
            O Nino cuida da tecnologia. Você cuida da comida.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
