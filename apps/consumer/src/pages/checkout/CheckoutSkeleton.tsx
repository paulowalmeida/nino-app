import styles from './Checkout.module.css'

/**
 * Espelha a forma real: comanda dobrada no topo, os blocos de campos e a
 * barra de destaque fixa embaixo. Cada peça tem a altura do que vai
 * substituí-la, pra não haver salto quando o conteúdo chega.
 */
export const CheckoutSkeleton = () => (
  <div
    className={styles.page}
    aria-busy="true"
    aria-label="Carregando o checkout"
  >
    <header className={styles.header}>
      <div className={styles.skBack} />
      <div className={styles.skTitle} />
    </header>

    <div className={styles.form}>
      <div className={styles.skReceipt} />

      <div className={styles.block}>
        <div className={styles.skLabel} />
        <div className={styles.skChoices}>
          <div className={styles.skChoice} />
          <div className={styles.skChoice} />
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.skLabel} />
        <div className={styles.skField} />
        <div className={styles.row}>
          <div className={styles.skField} />
          <div className={styles.skField} />
        </div>
        <div className={styles.skField} />
      </div>

      <div className={styles.block}>
        <div className={styles.skLabel} />
        <div className={styles.skField} />
        <div className={styles.skField} />
      </div>

      <div className={styles.block}>
        <div className={styles.skLabel} />
        <div className={styles.skChoices}>
          <div className={styles.skChoiceCompact} />
          <div className={styles.skChoiceCompact} />
        </div>
      </div>
    </div>

    <div className={styles.tearBar}>
      <div className={styles.tearTotals}>
        <div className={styles.skLabel} />
        <div className={styles.skTotal} />
      </div>
      <div className={styles.skSubmit} />
    </div>
  </div>
)
