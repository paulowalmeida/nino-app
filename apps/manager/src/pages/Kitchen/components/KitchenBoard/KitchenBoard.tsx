import { Grid } from '@nino/ds/components/Grid'
import { KitchenColumn } from '@pages/Kitchen/components/KitchenBoard/KitchenColumn/KitchenColumn'
import { KITCHEN_COLUMNS } from '@pages/Kitchen/constants/kitchen.constants'

import styles from './KitchenBoard.module.css'

export const KitchenBoard = () => {
  return (
    <Grid className={styles.board}>
      {KITCHEN_COLUMNS.map((column) => (
        <KitchenColumn key={column.stage} {...column} />
      ))}
    </Grid>
  )
}
