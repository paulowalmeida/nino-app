import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useOrdersFacade } from '@pages/Orders/facades/useOrdersFacade/useOrdersFacade'

import motion from '@styles/motion.module.css'
import styles from '@pages/Orders/components/OrdersHeader/OrdersHeader.module.css'

export const OrdersHeader = () => {
  const { isPagePending } = useOrdersFacade()

  if (isPagePending) {
    return (
      <Box
        aria-busy="true"
        align="center"
        className={`${motion.deal} ${styles.ordersHeader}`}
        direction="row"
        gap={3}
        justify="between"
        mb={{ mobile: 3, desktop: 6 }}
      >
        <Text as="p" role="status" className={styles.loadingLabel}>
          Carregando pedidos
        </Text>
        <Box direction="column" gap={1}>
          <Skeleton className={styles.skeletonTitle} />
          <Skeleton className={styles.skeletonDescription} />
        </Box>
      </Box>
    )
  }

  return (
    <Header
      mb={{ mobile: 3, desktop: 6 }}
      className={`${motion.deal} ${styles.ordersHeader}`}
      title="Pedidos"
      accent="Pedidos"
      description="Cada comanda mostra o próximo passo. Um toque move o pedido adiante."
    />
  )
}
