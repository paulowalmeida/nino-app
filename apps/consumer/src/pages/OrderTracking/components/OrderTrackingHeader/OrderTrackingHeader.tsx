import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import styles from './OrderTrackingHeader.module.css'

type OrderTrackingHeaderProps = {
  backHref: string
  orderNumber: number
}

export const OrderTrackingHeader = ({
  backHref,
  orderNumber,
}: OrderTrackingHeaderProps) => (
  <Box as="header" direction="row" className={styles.header}>
    <Link to={backHref} className={styles.back} aria-label="Voltar para a loja">
      <Icon name="arrow-left" />
    </Link>
    <Box>
      <Heading level={1} className={styles.title}>
        Seu pedido
      </Heading>
      <Text as="p" className={styles.code}>
        #{orderNumber}
      </Text>
    </Box>
  </Box>
)
