import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import styles from './CheckoutHeader.module.css'

type CheckoutHeaderProps = {
  backHref: string
  storeName: string
  storeLogoUrl?: string | null
}

export const CheckoutHeader = ({
  backHref,
  storeName,
  storeLogoUrl,
}: CheckoutHeaderProps) => (
  <Box as="header" direction="row" className={styles.checkoutHeader}>
    <Link to={backHref} className={styles.back} aria-label="Voltar">
      <Icon name="arrow-left" />
    </Link>
    <Box className={styles.storeMark} aria-hidden="true">
      {storeLogoUrl ? (
        <img src={storeLogoUrl} alt="" className={styles.checkoutHeaderLogo} />
      ) : (
        <Text as="span" className={styles.logoFallback}>
          {storeName.slice(0, 2).toUpperCase()}
        </Text>
      )}
    </Box>
    <Box className={styles.headText}>
      <Heading level={1} size="md" className={styles.checkoutHeaderTitle}>
        Finalizar pedido
      </Heading>
      <Text className={styles.storeLine}>{storeName}</Text>
    </Box>
  </Box>
)
