import { Box } from '@nino/ds/components/Box'
import { Label } from '@nino/ds/components/Label'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import { Textarea } from '@nino/ds/components/Textarea'
import { RecipientFields } from '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketFields/RecipientFields/RecipientFields'
import { NEW_ORDER_TICKET_CHANNELS } from '@pages/NewOrder/constants/new-order.constants'
import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'
import {
  CHANNEL_LABEL,
  PAYMENT_METHOD_LABEL_BY_CHANNEL,
} from '@shared/constants/order.constants'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'

import styles from './NewOrderTicketFields.module.css'

export const NewOrderTicketFields = () => {
  const { draft, availability } = useNewOrderFacade()
  const isDelivery = draft.channel === 'DELIVERY'

  return (
    <>
      <Box direction="column" gap={1.5}>
        <Text
          as="span"
          className={styles.newOrderTicketFieldsLabel}
          id="channel-label"
        >
          Como sai
        </Text>
        <Select
          options={NEW_ORDER_TICKET_CHANNELS.map((value) => ({
            value,
            label: CHANNEL_LABEL[value],
          }))}
          value={draft.channel}
          aria-labelledby="channel-label"
          onValueChange={(value) => draft.setChannel(value as OrderChannel)}
        />
      </Box>

      <RecipientFields
        value={draft.recipient}
        zones={availability.zoneOptions}
        hasAddress={isDelivery}
        onChange={draft.setRecipient}
      />

      <Box className={styles.newOrderTicketFieldsField}>
        <Text
          as="span"
          className={styles.newOrderTicketFieldsLabel}
          id="payment-label"
        >
          Pagamento
        </Text>
        <Select
          options={availability.methods.map((value) => ({
            value,
            label: PAYMENT_METHOD_LABEL_BY_CHANNEL[draft.channel][value],
          }))}
          value={availability.method}
          aria-labelledby="payment-label"
          onValueChange={(value) =>
            draft.setChosenMethod(value as PaymentMethod)
          }
        />
      </Box>

      <Box className={styles.newOrderTicketFieldsField}>
        <Label className={styles.newOrderTicketFieldsLabel} htmlFor="notes">
          Observação
        </Label>
        <Textarea
          id="notes"
          rows={2}
          placeholder="Sem cebola, ponto da carne…"
          value={draft.notes}
          onChange={(event) => draft.setNotes(event.target.value)}
        />
      </Box>
    </>
  )
}
