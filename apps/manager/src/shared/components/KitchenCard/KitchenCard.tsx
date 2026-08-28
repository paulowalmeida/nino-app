import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { CHANNEL_LABEL } from '@shared/constants/order.constants'
import { useElapsed } from '@shared/hooks/order/useElapsed/useElapsed'
import type { Order } from '@shared/types/order/order'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import { elapsedVar } from '@shared/utils/elapsed-var/elapsed-var'
import { nextStep } from '@shared/utils/order-action-policy/order-action-policy'
import { customerNameOf } from '@shared/utils/order-customer/order-customer'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

import motion from '@styles/motion.module.css'
import styles from './KitchenCard.module.css'

export type KitchenCardProps = {
  order: Order
  onAdvance: (orderId: string, target: OrderStatusKey) => void
  isBusy: boolean
  isCompact?: boolean
}

export const KitchenCard = ({
  order,
  onAdvance,
  isBusy,
  isCompact = false,
}: KitchenCardProps) => {
  const step = nextStep(order)
  const itemCount = order.items.reduce(
    (total, { quantity }) => total + quantity,
    0
  )
  const {
    label: elapsed,
    isLate,
    ratio,
    overdueRatio,
  } = useElapsed(order.acceptedAt ?? order.createdAt)

  const card = mergeClasses(
    motion.settle,
    styles.card,
    isLate && styles.late,
    isCompact && styles.compact
  )

  return (
    <Box as="article" className={card} style={elapsedVar(ratio, overdueRatio)}>
      <Box className={styles.ribbon} aria-hidden="true">
        <Box className={styles.fill} />
      </Box>

      <Box as="header" className={styles.head}>
        <Text as="span" className={styles.number}>
          {ticketNumber(order.orderNumber)}
        </Text>
        <Text as="span" className={styles.clock}>
          {elapsed}
        </Text>
        {isLate && (
          <Text as="span" className="sr-only">
            Pedido atrasado
          </Text>
        )}
      </Box>

      <Text as="p" className={styles.who}>
        <Text as="span" className={styles.channel}>
          {CHANNEL_LABEL[order.channel]}
        </Text>
        <Text as="span" className={styles.name}>
          {customerNameOf(order)}
        </Text>
        {order.tableNumber && (
          <Text as="span" className={styles.table}>
            mesa {order.tableNumber}
          </Text>
        )}
      </Text>

      {order.notes && !isCompact && (
        <Text as="p" className={styles.notes}>
          <Text as="span" className={styles.notesLabel}>
            Observação
          </Text>
          {order.notes}
        </Text>
      )}

      {isCompact ? (
        <Text as="p" className={styles.summary}>
          {itemCount === 1 ? '1 item' : `${itemCount} itens`}
        </Text>
      ) : (
        <Box as="ul" className={styles.items}>
          {order.items.map((item) => (
            <ListRow
              key={item.id}
              divider="none"
              padding={0}
              gap={0}
              className={styles.item}
            >
              <Text as="span" className={styles.quantity}>
                {item.quantity}
              </Text>
              <Text as="span" className={styles.itemName}>
                {item.product.name}
              </Text>
            </ListRow>
          ))}
        </Box>
      )}

      {step && (
        <Button
          size="lg"
          loading={isBusy}
          className={mergeClasses(motion.press, styles.action)}
          onClick={() => onAdvance(order.id, step.target)}
        >
          {step.label}
        </Button>
      )}
    </Box>
  )
}
