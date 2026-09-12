import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import type { Order } from '@shared/types/order/order'
import type { OrderChannel } from '@shared/types/order/order-channel'
import { consumerNameOf } from '@shared/utils/order-consumer/order-consumer'
import {
  orderDestination,
} from '@shared/utils/order-destination/order-destination'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

export type KitchenOrderModalProps = {
  order: Order | null
  salesFormats: OrderChannel[]
  onOpenChange: (open: boolean) => void
}

export const KitchenOrderModal = ({
  order,
  salesFormats,
  onOpenChange,
}: KitchenOrderModalProps) => {
  const destination = order && orderDestination(order, salesFormats)
  const title = order ? `Pedido #${ticketNumber(order.orderNumber)}` : 'Pedido'

  return (
    <Modal
      open={!!order}
      onOpenChange={onOpenChange}
      size="md"
      ariaLabel={title}
      header={
        order && (
          <Box direction="row" align="center" gap={2}>
            <Heading level={2} size="lg">
              {title}
            </Heading>
            {destination && (
              <Badge size="sm">{destination.label}</Badge>
            )}
          </Box>
        )
      }
      body={
        order && (
          <Box direction="column" gap={4}>
            {order.guestName && <Text>{consumerNameOf(order)}</Text>}

            <Box as="ul" direction="column" gap={1.5}>
              {order.items.map((item) => (
                <Box as="li" key={item.id}>
                  <Text as="span">
                    {item.quantity}× {item.product.name}
                  </Text>
                </Box>
              ))}
            </Box>

            {order.notes && (
              <Box direction="column" gap={1}>
                <Text size="xs" color="subtle">
                  Observação
                </Text>
                <Text size="sm">{order.notes}</Text>
              </Box>
            )}
          </Box>
        )
      }
    />
  )
}
