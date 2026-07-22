import styles from './Checkout.module.css'

/** Espera com a forma do checkout: cabeçalho, campos do formulário e resumo. */
export const CheckoutSkeleton = () => (
  <div
    className={styles.page}
    aria-busy="true"
    aria-label="Carregando o checkout"
  >
    <header className={styles.header}>
      <span className={styles.back}>←</span>
      <div className={styles.skTitle} />
    </header>

    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.skSectionTitle} />
        <div className={styles.skField} />
      </div>

      <div className={styles.section}>
        <div className={styles.skSectionTitle} />
        <div className={styles.skField} />
        <div className={styles.skField} />
      </div>

      <div className={styles.skSummary}>
        <div className={styles.skSummaryLine} />
        <div className={styles.skSummaryLine} />
        <div className={styles.skSummaryLine} />
      </div>
    </div>
  </div>
)
