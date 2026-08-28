import { Button } from '@nino/ds/components/Button'
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
    <div className={styles.confirmed}>
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
      <p className={styles.text}>
        {isPickup
          ? 'A loja já recebeu e vai preparar. Guarde o código para retirar no balcão.'
          : 'A loja já recebeu e vai preparar. Guarde o código para acompanhar a entrega.'}
      </p>
      <p className={styles.code}>#{order.orderNumber}</p>
      <Button onClick={onTrack}>Acompanhar pedido</Button>
      <Button variant="ghost" onClick={onBackToStore}>
        Voltar para a loja
      </Button>
    </div>
  )
}
