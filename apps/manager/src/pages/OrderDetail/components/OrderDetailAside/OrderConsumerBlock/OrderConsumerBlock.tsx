import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'
import {
  addressOf,
  consumerNameOf,
} from '@shared/utils/order-consumer/order-consumer'
import { formatPhone } from '@shared/utils/phone/phone'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './OrderConsumerBlock.module.css'

export const OrderConsumerBlock = () => {
  const { order } = useOrderDetailFacade()

  if (!order) return null

  const address = addressOf(order)

  return (
    <Box as="section"
      aria-label="Quem pediu"
      className={`${motion.deal} ${styles.block}`}
      style={riseDelay(80)}
    >
      <h2 className={styles.cardTitle}>Quem pediu</h2>
      <Text className={styles.consumer}>{consumerNameOf(order)}</Text>

      {order.guestPhone && (
        <a href={`tel:${order.guestPhone}`} className={styles.phone}>
          {formatPhone(order.guestPhone)}
        </a>
      )}

      {address && <Text className={styles.address}>{address}</Text>}

      {order.tableNumber && (
        <Text className={styles.address}>Mesa {order.tableNumber}</Text>
      )}
    </Box>
  )
}
