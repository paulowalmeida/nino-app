import { EmptyState } from '@nino/ds/components/EmptyState'
import { AddressesEmptyIllustration } from '@shared/components/Illustrations/AddressesEmptyIllustration/AddressesEmptyIllustration'

import styles from './AddressesEmptyState.module.css'

export const AddressesEmptyState = () => (
  <EmptyState
    size="md"
    className={styles.addressesEmptyStateEmpty}
    illustration={<AddressesEmptyIllustration />}
    title="Onde entregamos?"
  >
    Você ainda não salvou nenhum endereço. O primeiro que salvar vira o
    principal.
  </EmptyState>
)
