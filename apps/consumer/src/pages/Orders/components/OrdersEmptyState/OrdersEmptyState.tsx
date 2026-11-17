import { EmptyState } from '@nino/ds/components/EmptyState'
import { OrdersEmptyIllustration } from '@shared/components/Illustrations/OrdersEmptyIllustration/OrdersEmptyIllustration'

import styles from './OrdersEmptyState.module.css'

export const OrdersEmptyState = () => (
  <EmptyState
    size="md"
    className={styles.ordersEmptyStateEmpty}
    illustration={<OrdersEmptyIllustration />}
    title="Nenhum pedido por aqui"
  >
    Seus pedidos aparecem aqui assim que você fizer o primeiro.
  </EmptyState>
)
