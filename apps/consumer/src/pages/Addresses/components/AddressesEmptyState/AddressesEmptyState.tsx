import { EmptyState } from '@nino/ds/components/EmptyState'

import styles from './AddressesEmptyState.module.css'

export const AddressesEmptyState = () => (
  <EmptyState size="md" className={styles.addressesEmptyStateEmpty}>
    Você ainda não salvou nenhum endereço. O primeiro que salvar vira o
    principal.
  </EmptyState>
)
