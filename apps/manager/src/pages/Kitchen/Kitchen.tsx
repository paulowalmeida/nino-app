import { Box } from '@nino/ds/components/Box'
import { KitchenBoard } from '@pages/Kitchen/components/KitchenBoard/KitchenBoard'

import styles from './Kitchen.module.css'

export const Kitchen = () => {
  return (
    <Box className={styles.screen}>
      <KitchenBoard />
    </Box>
  )
}
