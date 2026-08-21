import { useNavigate } from 'react-router'

import { Header } from '@nino/ds/components/Header'
import { BackLink } from '@atoms/BackLink/BackLink'
import { NewOrderMenu } from '@organisms/NewOrderMenu/NewOrderMenu'
import { NewOrderTicket } from '@organisms/NewOrderTicket/NewOrderTicket'
import { useNewOrderAvailability } from '@hooks/order/useNewOrderAvailability'
import { useNewOrderDraft } from '@hooks/order/useNewOrderDraft'
import { useSubmitNewOrder } from '@hooks/order/useSubmitNewOrder'
import { useMenu } from '@hooks/product/useMenu'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'

import styles from './NewOrder.module.css'

export const NewOrder = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const navigate = useNavigate()

  const { sections, isPending: isMenuPending } = useMenu(tenantId)
  const draft = useNewOrderDraft()
  const availability = useNewOrderAvailability(tenantId, {
    channel: draft.channel,
    chosenMethod: draft.chosenMethod,
    recipient: draft.recipient,
  })
  const { failed, isSubmitting, submit } = useSubmitNewOrder(tenantId)

  const handlePlace = async () => {
    const orderId = await submit({
      lines: draft.lines,
      channel: draft.channel,
      paymentMethod: availability.method,
      recipient: draft.recipient,
      notes: draft.notes,
    })
    if (orderId) void navigate(`../${orderId}`, { relative: 'path' })
  }

  return (
    <div className={styles.page}>
      <BackLink>Pedidos</BackLink>

      <Header
        mt={4}
        mb={5}
        title="Pedido na mão"
        accent="mão"
        description="Para quem pediu no balcão ou ligou para a loja. O pedido entra na fila do mesmo jeito que o do app."
      />

      <div className={styles.columns}>
        <NewOrderMenu
          sections={sections}
          isPending={isMenuPending}
          onAdd={draft.add}
        />

        <NewOrderTicket
          lines={draft.lines}
          subtotal={draft.subtotal}
          fee={availability.fee}
          channel={draft.channel}
          onChannelChange={draft.setChannel}
          method={availability.method}
          methods={availability.methods}
          onMethodChange={draft.setChosenMethod}
          recipient={draft.recipient}
          zoneOptions={availability.zoneOptions}
          onRecipientChange={draft.setRecipient}
          notes={draft.notes}
          onNotesChange={draft.setNotes}
          isPaused={availability.isPaused}
          closedNow={availability.closedNow}
          missingRecipient={availability.missingRecipient}
          failed={failed}
          isPlacing={isSubmitting}
          onStep={draft.step}
          onPlace={handlePlace}
        />
      </div>
    </div>
  )
}
