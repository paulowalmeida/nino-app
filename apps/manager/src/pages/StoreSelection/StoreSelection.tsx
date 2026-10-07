import { Box } from '@nino/ds/components/Box'
import { CompanyPickList } from '@pages/StoreSelection/components/CompanyPickList/CompanyPickList'
import { StoreSelectionHeader } from '@pages/StoreSelection/components/StoreSelectionHeader/StoreSelectionHeader'

import motion from '@styles/motion.module.css'
import styles from './StoreSelection.module.css'

export const StoreSelection = () => (
  <Box direction="row" className={styles.storeSelectionShell}>
    <Box direction="column" className={`${motion.settle} ${styles.storeSelectionPanel}`}>
      <StoreSelectionHeader />
      <CompanyPickList />
    </Box>
  </Box>
)
