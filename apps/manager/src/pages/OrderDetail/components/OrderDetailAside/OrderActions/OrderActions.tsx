import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { OrderCancelForm } from '@pages/OrderDetail/components/OrderDetailAside/OrderActions/OrderCancelForm/OrderCancelForm'
import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './OrderActions.module.css'

export const OrderActions = () => {
  const {
    order,
    nextStep,
    canAdvance,
    canCancelOrder,
    advanceOrder,
    isAdvancing,
  } = useOrderDetailFacade()
  const [isNamingReason, setNamingReason] = useState(false)

  if (!order || (!canAdvance && !canCancelOrder)) return null

  return (
    <section
      aria-label="Ações do pedido"
      className={`${motion.settle} ${styles.actions}`}
      style={riseDelay(260)}
    >
      {canAdvance && nextStep && (
        <Button
          loading={isAdvancing}
          className={`${motion.press} ${styles.advance}`}
          onClick={() =>
            advanceOrder({ orderId: order.id, status: nextStep.target })
          }
        >
          {nextStep.label}
        </Button>
      )}

      {canCancelOrder && !isNamingReason && (
        <Button variant="ghost" size="sm" onClick={() => setNamingReason(true)}>
          Cancelar pedido
        </Button>
      )}

      {isNamingReason && (
        <OrderCancelForm
          onCancelled={() => setNamingReason(false)}
          onDismiss={() => setNamingReason(false)}
        />
      )}
    </section>
  )
}
