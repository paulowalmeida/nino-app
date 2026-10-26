import { FeatureCard } from "@features/_components/feature-card/FeatureCard"

import { features } from "./features.constants"
import styles from "./Features.module.css"

export function Features() {
  return (
    <section className={styles.featuresSection} id="features">
      <div className={styles.featuresInner}>
        <div className={styles.featuresHeader}>
          <span className={styles.eyebrow}>Plataforma completa</span>

          <h2 className={styles.featuresTitle}>
            Tudo que você precisa,{" "}
            <span className={styles.titleAccent}>nada que te atrapalha</span>
          </h2>

          <p className={styles.featuresSubtitle}>
            O Nino cuida da tecnologia. Você cuida da comida.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
