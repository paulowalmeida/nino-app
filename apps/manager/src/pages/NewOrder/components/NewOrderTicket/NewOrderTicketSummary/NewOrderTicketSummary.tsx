import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'
import { brl } from '@shared/utils/money/money'

import styles from '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketSummary/NewOrderTicketSummary.module.css'

export const NewOrderTicketSummary = () => {
  const { draft, availability } = useNewOrderFacade()
  const isDelivery = draft.channel === 'DELIVERY'

  return (
    <>
      {isDelivery && availability.fee > 0 && (
        <Box direction="row" justify="between" className={styles.feeRow}>
          <Text as="span">Entrega</Text>
          <Text as="span">{brl(availability.fee)}</Text>
        </Box>
      )}

      <Box direction="row" justify="between" className={styles.newOrderTicketSummaryTotal}>
        <Text as="span">Total</Text>
        <Text as="span">{brl(draft.subtotal + availability.fee)}</Text>
      </Box>
    </>
  )
}
