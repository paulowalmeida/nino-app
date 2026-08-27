import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { NewOrderTicketActions } from '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketActions/NewOrderTicketActions'
import { NewOrderTicketFields } from '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketFields/NewOrderTicketFields'
import { NewOrderTicketLines } from '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketLines/NewOrderTicketLines'
import { NewOrderTicketSummary } from '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketSummary/NewOrderTicketSummary'
import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'

import styles from '@pages/NewOrder/components/NewOrderTicket/NewOrderTicket.module.css'

export const NewOrderTicket = () => {
  const { draft } = useNewOrderFacade()

  return (
    <Box as="aside" className={styles.ticket}>
      <Heading level={2} className={styles.ticketTitle}>
        A comanda
      </Heading>

      {draft.lines.length === 0 && (
        <EmptyState>
          Nada na comanda ainda. Toque em Adicionar no item do cardápio.
        </EmptyState>
      )}

      <NewOrderTicketLines />
      <NewOrderTicketSummary />
      <NewOrderTicketFields />
      <NewOrderTicketActions />
    </Box>
  )
}
