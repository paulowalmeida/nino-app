import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import type { GuestOrderCreatedResponse } from '@custom_types/order/guest-order-created-response'

import styles from './OrderConfirmed.module.css'

type OrderConfirmedProps = {
  order: GuestOrderCreatedResponse
  onTrack: () => void
  onBackToStore: () => void
}

/** A tela que fecha o checkout: código do pedido e para onde ir a seguir. */
export const OrderConfirmed = ({
  order,
  onTrack,
  onBackToStore,
}: OrderConfirmedProps) => {
  const isPickup = order.channel === 'PICKUP'

  return (
    <Box className={styles.confirmed}>
      <img
        src={
          isPickup
            ? '/mascot-consumer-pickup.svg'
            : '/mascot-consumer-delivery.svg'
        }
        alt=""
        className={styles.mascot}
      />
      <h1 className={styles.title}>Pedido enviado!</h1>
      <Text className={styles.text}>
        {isPickup
          ? 'A loja já recebeu e vai preparar. Guarde o código para retirar no balcão.'
          : 'A loja já recebeu e vai preparar. Guarde o código para acompanhar a entrega.'}
      </Text>
      <Text className={styles.code}>#{order.orderNumber}</Text>
      <Button onClick={onTrack}>Acompanhar pedido</Button>
      <Button variant="ghost" onClick={onBackToStore}>
        Voltar para a loja
      </Button>
    </Box>
  )
}
