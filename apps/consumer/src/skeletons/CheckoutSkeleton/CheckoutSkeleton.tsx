import headerStyles from '@compositions/CheckoutHeader/CheckoutHeader.module.css'
import addressStyles from '@compositions/DeliveryAddressFields/DeliveryAddressFields.module.css'
import blockStyles from '@compositions/ChannelFields/ChannelFields.module.css'
import footerStyles from '@compositions/CheckoutFooter/CheckoutFooter.module.css'
import styles from '@pages/checkout/Checkout.module.css'

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
    <header className={headerStyles.header}>
      <div className={styles.skBack} />
      <div className={styles.skTitle} />
    </header>

    <div className={styles.form}>
      <div className={styles.skReceipt} />

      <div className={blockStyles.block}>
        <div className={styles.skLabel} />
        <div className={styles.skChoices}>
          <div className={styles.skChoice} />
          <div className={styles.skChoice} />
        </div>
      </div>

      <div className={blockStyles.block}>
        <div className={styles.skLabel} />
        <div className={styles.skField} />
        <div className={addressStyles.row}>
          <div className={styles.skField} />
          <div className={styles.skField} />
        </div>
        <div className={styles.skField} />
      </div>

      <div className={blockStyles.block}>
        <div className={styles.skLabel} />
        <div className={styles.skField} />
        <div className={styles.skField} />
      </div>

      <div className={blockStyles.block}>
        <div className={styles.skLabel} />
        <div className={styles.skChoices}>
          <div className={styles.skChoiceCompact} />
          <div className={styles.skChoiceCompact} />
        </div>
      </div>
    </div>

    <div className={footerStyles.tearBar}>
      <div className={footerStyles.totals}>
        <div className={styles.skLabel} />
        <div className={styles.skTotal} />
      </div>
      <div className={styles.skSubmit} />
    </div>
  </div>
)
