import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
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
  const [pickupCode, setPickupCode] = useState('')

  if (!order || (!canAdvance && !canCancelOrder)) return null
  const requiresPickupCode =
    order.channel === 'PICKUP' &&
    !!order.pickupCode &&
    nextStep?.target === 'COMPLETED'

  return (
    <section
      aria-label="Ações do pedido"
      className={`${motion.settle} ${styles.actions}`}
      style={riseDelay(260)}
    >
      {canAdvance && requiresPickupCode && (
        <FormField label="Código de retirada">
          <Input
            aria-label="Código de retirada"
            inputMode="numeric"
            maxLength={6}
            value={pickupCode}
            onChange={(event) =>
              setPickupCode(event.target.value.replace(/\D/g, ''))
            }
          />
        </FormField>
      )}
      {canAdvance && nextStep && (
        <Button
          disabled={requiresPickupCode && pickupCode.length !== 6}
          loading={isAdvancing}
          className={`${motion.press} ${styles.advance}`}
          onClick={() =>
            advanceOrder({
              orderId: order.id,
              status: nextStep.target,
              ...(requiresPickupCode ? { pickupCode } : {}),
            })
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
