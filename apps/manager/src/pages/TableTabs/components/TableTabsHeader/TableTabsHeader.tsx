import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { OpenTabDialog } from '@pages/TableTabs/components/TableTabsHeader/OpenTabDialog/OpenTabDialog'
import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'
import { useRouteAction } from '@shared/hooks/ui/useRouteAction/useRouteAction'

import motion from '@styles/motion.module.css'
import styles from './TableTabsHeader.module.css'

export const TableTabsHeader = () => {
  const [isOpeningTab, setOpeningTab] = useState(false)
  useRouteAction('abrir-comanda', () => setOpeningTab(true))
  const { isPending } = useTableTabsFacade()

  if (isPending) {
    return (
      <Box
        aria-busy="true"
        align="start"
        className={`${styles.tableTabsHeader} ${motion.deal} ${styles.headerSkeleton}`}
        direction="row"
        gap={4}
        justify="between"
      >
        <Text as="p" role="status" className={styles.loadingLabel}>
          Carregando comandas
        </Text>
        <Box direction="column" gap={1}>
          <Skeleton className={styles.skeletonTitle} />
          <Skeleton className={styles.skeletonDescription} />
        </Box>
        <Skeleton className={styles.skeletonAction} />
      </Box>
    )
  }

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
      <OpenTabDialog open={isOpeningTab} onClose={() => setOpeningTab(false)} />
    </Box>
  )
}
