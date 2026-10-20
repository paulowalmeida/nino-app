import { Box } from '@nino/ds/components/Box'
import { CompanyPickList } from '@pages/StoreSelection/components/CompanyPickList/CompanyPickList'
import { StoreSelectionHeader } from '@pages/StoreSelection/components/StoreSelectionHeader/StoreSelectionHeader'

import styles from './StoreSelection.module.css'

export const StoreSelection = () => (
  <Box direction="row" className={styles.storeSelectionShell}>
    <Box direction="column" className={styles.storeSelectionPanel}>
      <StoreSelectionHeader />
      <CompanyPickList />
    </Box>
  </Box>
)
