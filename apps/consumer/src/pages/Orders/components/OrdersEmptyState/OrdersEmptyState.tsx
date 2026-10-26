import { EmptyState } from '@nino/ds/components/EmptyState'

import styles from './OrdersEmptyState.module.css'

export const OrdersEmptyState = () => (
  <EmptyState size="md" className={styles.ordersEmptyStateEmpty}>
    Seus pedidos aparecem aqui assim que você fizer o primeiro.
  </EmptyState>
)
