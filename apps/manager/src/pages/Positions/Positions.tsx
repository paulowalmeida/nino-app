import { Box } from '@nino/ds/components/Box'

import { PositionsContent } from './components/PositionsContent/PositionsContent'
import { PositionsHeader } from './components/PositionsHeader/PositionsHeader'

import styles from './Positions.module.css'

export const Positions = () => (
  <Box className={styles.positionsPage}>
    <PositionsHeader />
    <PositionsContent />
  </Box>
)
