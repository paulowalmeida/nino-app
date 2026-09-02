import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Image } from '@nino/ds/components/Image'
import { Text } from '@nino/ds/components/Text'
import type { OrderCreatedResponse } from '@custom_types/order/order-created-response'

import styles from './OrderConfirmed.module.css'

type OrderConfirmedProps = {
  order: OrderCreatedResponse
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
      <Image
        src={
          isPickup
            ? '/mascot-consumer-pickup.svg'
            : '/mascot-consumer-delivery.svg'
        }
        alt=""
        className={styles.mascot}
      />
      <Heading level={1} size="2xl" className={styles.title}>
        Pedido enviado!
      </Heading>
      <Text className={styles.text}>
        {isPickup
          ? 'A loja já recebeu e vai preparar. Guarde o código para '
            + 'retirar no balcão.'
          : 'A loja já recebeu e vai preparar. Guarde o código para '
            + 'acompanhar a entrega.'}
      </Text>
      <Text className={styles.code}>#{order.orderNumber}</Text>
      <Button onClick={onTrack}>Acompanhar pedido</Button>
      <Button variant="ghost" onClick={onBackToStore}>
        Voltar para a loja
      </Button>
    </Box>
  )
}
