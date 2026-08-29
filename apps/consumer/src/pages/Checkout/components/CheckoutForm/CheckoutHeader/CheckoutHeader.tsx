import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
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
      <Heading level={1} size="md" className={styles.title}>
        Finalizar pedido
      </Heading>
      <Text className={styles.storeLine}>{storeName}</Text>
    </Box>
  </Box>
)
