import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { OpenTabDialog } from '@pages/TableTabs/components/TableTabsHeader/OpenTabDialog/OpenTabDialog'

import motion from '@styles/motion.module.css'
import styles from './TableTabsHeader.module.css'

export const TableTabsHeader = () => {
  const [isOpeningTab, setOpeningTab] = useState(false)

  return (
    <Box className={styles.tableTabsHeader}>
      <Header
        className={motion.deal}
        title="Comandas"
        accent="Comandas"
        description="Acompanhe as mesas abertas e feche a conta quando o cliente pedir."
        actions={
          <Button onClick={() => setOpeningTab(true)}>Abrir comanda</Button>
        }
      />
      <OpenTabDialog
        open={isOpeningTab}
        onClose={() => setOpeningTab(false)}
      />
    </Box>
  )
}
