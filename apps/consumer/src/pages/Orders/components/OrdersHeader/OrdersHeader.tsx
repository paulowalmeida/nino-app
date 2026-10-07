import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'

import styles from './OrdersHeader.module.css'

export const OrdersHeader = () => (
  <Box>
    <Eyebrow>Pedidos</Eyebrow>
    <Heading level={2} size="lg" color="muted">
      Tudo que você já pediu aqui
    </Heading>
    <Text className={styles.ordersHeaderNote}>
      Toque em um pedido para ver a comanda, os valores e como foi o
      pagamento.
    </Text>
  </Box>
)
