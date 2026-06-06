import Image from "next/image"

import { TrackingStep } from "@demo/_tabs/tracking/_components/tracking-step/TrackingStep"

import { trackingSteps } from "./trackingTab.constants"
import styles from "./TrackingTab.module.css"

export function TrackingTab() {
  return (
    <div>
      <div className={styles.orderHeader}>
        <div>
          <div className={styles.orderTitle}>Pedido #1042</div>

          <div className={styles.orderSubtitle}>
            Burgão do Zé · 1 Combo Família
          </div>
        </div>

        <div className={styles.statusBadge}>
          <span className={styles.statusPulseDot} />A caminho
        </div>
      </div>

      <div className={styles.mapContainer}>
        <Image
          src="/assets/map-mockup.svg"
          alt=""
          width={400}
          height={200}
          className={styles.mapImage}
        />
      </div>

      <div className={styles.courierSection}>
        <div className={styles.courierProfile}>
          <div className={styles.courierAvatar}>👤</div>

          <div>
            <div className={styles.courierName}>Carlos Silva</div>

            <div className={styles.courierDetails}>
              ⭐ 4.9 · Honda CG · ABC-1234
            </div>
          </div>
        </div>

        <div className={styles.courierContactActions}>
          <button className={styles.contactButtonSecondary}>💬</button>

          <button className={styles.contactButtonPrimary}>📞</button>
        </div>
      </div>

      <div className={styles.deliveryTimeline}>
        {trackingSteps.map((step, i) => (
          <TrackingStep
            key={step.label}
            {...step}
            isLast={i === trackingSteps.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
