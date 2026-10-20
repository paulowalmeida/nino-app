import { useEffect } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { NewOrderMenu } from '@pages/NewOrder/components/NewOrderMenu/NewOrderMenu'
import { NewOrderTicket } from '@pages/NewOrder/components/NewOrderTicket/NewOrderTicket'
import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'
import { BackLink } from '@shared/components/BackLink/BackLink'

import motion from '@styles/motion.module.css'
import styles from './NewOrder.module.css'

const DESCRIPTION =
  'Para quem pediu no balcão ou ligou para a loja. O pedido entra na fila ' +
  'do mesmo jeito que o do app.'

export const NewOrder = () => {
  const { resetDraft } = useNewOrderFacade()

  useEffect(() => {
    resetDraft()
  }, [resetDraft])

  return (
    <Box className={styles.newOrderPage}>
      <BackLink>Pedidos</BackLink>

      <Header
        mt={4}
        mb={5}
        className={motion.deal}
        title="Pedido na mão"
        accent="mão"
        description={DESCRIPTION}
      />

      <Box className={styles.columns}>
        <NewOrderMenu />
        <NewOrderTicket />
      </Box>
    </Box>
  )
}
