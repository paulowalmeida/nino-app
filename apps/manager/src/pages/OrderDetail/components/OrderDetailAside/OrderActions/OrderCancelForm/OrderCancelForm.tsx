import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Label } from '@nino/ds/components/Label'
import { Textarea } from '@nino/ds/components/Textarea'
import { CANCEL_REASON_MAX_LENGTH } from '@pages/OrderDetail/constants/order-detail.constants'
import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'

import motion from '@styles/motion.module.css'
import styles from './OrderCancelForm.module.css'

type OrderCancelFormProps = {
  onCancelled: () => void
  onDismiss: () => void
}

export const OrderCancelForm = ({
  onCancelled,
  onDismiss,
}: OrderCancelFormProps) => {
  const { cancelOrder, isCancelling } = useOrderDetailFacade()
  const [reason, setReason] = useState('')

  const confirm = async () => {
    const cancelled = await cancelOrder(reason)
    if (cancelled) onCancelled()
  }

  return (
    <Box className={`${motion.unroll} ${styles.cancelBox}`}>
      <Label className={styles.cancelLabel} htmlFor="cancel-reason">
        Por que o pedido está sendo cancelado?
      </Label>

      <Textarea
        id="cancel-reason"
        rows={2}
        value={reason}
        maxLength={CANCEL_REASON_MAX_LENGTH}
        placeholder="O cliente vê este motivo"
        onChange={(event) => setReason(event.target.value)}
      />

      <Box gap={2} wrap>
        <Button
          size="sm"
          loading={isCancelling}
          disabled={reason.trim().length === 0}
          onClick={() => void confirm()}
        >
          Confirmar cancelamento
        </Button>
        <Button size="sm" variant="ghost" onClick={onDismiss}>
          Voltar
        </Button>
      </Box>
    </Box>
  )
}
