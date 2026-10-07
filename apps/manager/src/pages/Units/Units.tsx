import { Box } from '@nino/ds/components/Box'

import { UnitsHeader } from './components/UnitsHeader/UnitsHeader'
import { UnitsSetup } from './components/UnitsSetup/UnitsSetup'
import { UnitsTopBar } from './components/UnitsTopBar/UnitsTopBar'

import styles from './Units.module.css'

export const Units = () => (
  <Box className={styles.unitsShell}>
    <UnitsTopBar />
    <Box as="main" className={styles.unitsPage}>
      <UnitsHeader />
      <UnitsSetup />
    </Box>
  </Box>
)
