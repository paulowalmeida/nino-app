import { Header } from '@nino/ds/components/Header'

import motion from '@styles/motion.module.css'
import styles from './StoreSelectionHeader.module.css'

export const StoreSelectionHeader = () => (
  <Header
    className={`${motion.deal} ${styles.storeSelectionHeaderTitle}`}
    size="2xl"
    title="Seus restaurantes"
    description="Escolha qual você quer gerenciar"
  />
)
