import { TrackingStep } from "@demo/_tabs/tracking/_components/tracking-step/TrackingStep"

import { notifications, trackingSteps } from "./trackingTab.constants"
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
          <span className={styles.statusPulseDot} />
          Em preparo
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

      <section className={styles.notices}>
        <p className={styles.noticesTitle}>
          💬 O que chegou no WhatsApp dele
        </p>

        {notifications.map(({ time, text }) => (
          <div key={time} className={styles.bubble}>
            <p className={styles.bubbleText}>{text}</p>

            <span className={styles.bubbleTime}>{time} ✓✓</span>
          </div>
        ))}

        <p className={styles.noticesFine}>
          Enviado pelo Nino a cada mudança de status — ninguém da loja precisa
          parar pra responder &ldquo;cadê meu pedido?&rdquo;.
        </p>
      </section>
    </div>
  )
}
