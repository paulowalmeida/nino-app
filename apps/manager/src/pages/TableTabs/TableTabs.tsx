import { Box } from '@nino/ds/components/Box'
import { TableTabsBoard } from '@pages/TableTabs/components/TableTabsBoard/TableTabsBoard'
import { TableTabsHeader } from '@pages/TableTabs/components/TableTabsHeader/TableTabsHeader'

import styles from './TableTabs.module.css'

export const TableTabs = () => (
  <Box className={styles.tableTabsPage}>
    <TableTabsHeader />
    <TableTabsBoard />
  </Box>
)
