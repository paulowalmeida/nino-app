import { Box } from '@nino/ds/components/Box'
import headerStyles from '@pages/checkout/components/CheckoutForm/CheckoutHeader/CheckoutHeader.module.css'
import addressStyles from '@pages/checkout/components/CheckoutForm/DeliveryAddressFields/DeliveryAddressFields.module.css'
import blockStyles from '@pages/checkout/components/CheckoutForm/ChannelFields/ChannelFields.module.css'
import footerStyles from '@pages/checkout/components/CheckoutForm/CheckoutFooter/CheckoutFooter.module.css'
import formStyles from '@pages/checkout/components/CheckoutForm/CheckoutForm.module.css'
import styles from './CheckoutSkeleton.module.css'

/**
 * Espelha a forma real: comanda dobrada no topo, os blocos de campos e a
 * barra de destaque fixa embaixo. Cada peça tem a altura do que vai
 * substituí-la, pra não haver salto quando o conteúdo chega.
 */
export const CheckoutSkeleton = () => (
  <Box
    className={styles.checkoutSkeletonPage}
    aria-busy="true"
    aria-label="Carregando o checkout"
  >
    <Box as="header" className={headerStyles.header}>
      <Box className={styles.skBack} />
      <Box className={styles.skTitle} />
    </Box>

    <Box className={formStyles.form}>
      <Box className={styles.skReceipt} />

      <Box className={blockStyles.block}>
        <Box className={styles.skLabel} />
        <Box className={styles.skChoices}>
          <Box className={styles.skChoice} />
          <Box className={styles.skChoice} />
        </Box>
      </Box>

      <Box className={blockStyles.block}>
        <Box className={styles.skLabel} />
        <Box className={styles.skField} />
        <Box className={addressStyles.row}>
          <Box className={styles.skField} />
          <Box className={styles.skField} />
        </Box>
        <Box className={styles.skField} />
      </Box>

      <Box className={blockStyles.block}>
        <Box className={styles.skLabel} />
        <Box className={styles.skField} />
        <Box className={styles.skField} />
      </Box>

      <Box className={blockStyles.block}>
        <Box className={styles.skLabel} />
        <Box className={styles.skChoices}>
          <Box className={styles.skChoiceCompact} />
          <Box className={styles.skChoiceCompact} />
        </Box>
      </Box>
    </Box>

    <Box className={footerStyles.tearBar}>
      <Box className={footerStyles.totals}>
        <Box className={styles.skLabel} />
        <Box className={styles.skTotal} />
      </Box>
      <Box className={styles.skSubmit} />
    </Box>
  </Box>
)
