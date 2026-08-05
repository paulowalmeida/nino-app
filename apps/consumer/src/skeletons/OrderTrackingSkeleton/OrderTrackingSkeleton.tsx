import styles from '@pages/order-tracking/OrderTracking.module.css'

/**
 * Espelha a forma real: cabeçalho com a volta e o título, o cartão vivo do
 * estágio atual e a trilha de passos — cada peça com a altura do que vai
 * substituí-la, pra não haver salto quando o pedido chega.
 */
export const OrderTrackingSkeleton = () => (
  <div
    className={styles.page}
    aria-busy="true"
    aria-label="Carregando o pedido"
  >
    <header className={styles.header}>
      <div className={styles.skBack} />
      <div className={styles.skTitle} />
    </header>
    <div className={styles.skStage} />
    <div className={styles.skJourney}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={styles.skRow}>
          <div className={styles.skDot} />
          <div className={styles.skLabel} />
          <div className={styles.skTime} />
        </div>
      ))}
    </div>
  </div>
)
