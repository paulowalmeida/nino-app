import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import styles from './CheckoutHeader.module.css'

type CheckoutHeaderProps = {
  backHref: string
  storeName: string
}

export const CheckoutHeader = ({
  backHref,
  storeName,
}: CheckoutHeaderProps) => (
  <Box as="header" className={styles.header}>
    <Link to={backHref} className={styles.back} aria-label="Voltar">
      <Icon name="arrow-left" />
    </Link>
    <Box className={styles.headText}>
      <h1 className={styles.title}>Finalizar pedido</h1>
      <Text className={styles.storeLine}>{storeName}</Text>
    </Box>
  </Box>
)
