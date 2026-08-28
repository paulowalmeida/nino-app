import { Grid } from '@nino/ds/components/Grid'
import { KitchenColumn } from '@pages/Kitchen/components/KitchenBoard/KitchenColumn/KitchenColumn'
import { KITCHEN_COLUMNS } from '@pages/Kitchen/constants/kitchen.constants'

import styles from './KitchenBoard.module.css'

export type KitchenBoardProps = {
  isCompact: boolean
}

export const KitchenBoard = ({ isCompact }: KitchenBoardProps) => {
  return (
    <Grid className={styles.board}>
      {KITCHEN_COLUMNS.map((column) => (
        <KitchenColumn key={column.stage} {...column} isCompact={isCompact} />
      ))}
    </Grid>
  )
}
