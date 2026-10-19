import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Chip } from '@nino/ds/components/Chip'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { TableTabCard } from '@pages/TableTabs/components/TableTabsBoard/TableTabCard/TableTabCard'
import { TABLE_TABS_EMPTY_MESSAGE } from '@pages/TableTabs/constants/tableTabs.constants'
import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'
import { TableTabsListSkeleton } from '@pages/TableTabs/skeletons/TableTabsListSkeleton/TableTabsListSkeleton'
import { filterTableTabs } from '@pages/TableTabs/utils/filterTableTabs/filterTableTabs'

import motion from '@styles/motion.module.css'
import styles from './TableTabsBoard.module.css'

type TabGroup = 'active' | 'finalized'

export const TableTabsBoard = () => {
  const { activeTabs, finalizedTabs, isPending, isError } =
    useTableTabsFacade()
  const [group, setGroup] = useState<TabGroup>('active')
  const [search, setSearch] = useState('')
  const isSearching = search.trim().length > 0
  const groupTabs = group === 'active' ? activeTabs : finalizedTabs
  const searchableTabs = isSearching
    ? [...activeTabs, ...finalizedTabs]
    : groupTabs
  const visibleTabs = filterTableTabs(searchableTabs, search)
  const emptyMessage =
    TABLE_TABS_EMPTY_MESSAGE[isSearching ? 'search' : group]

  return (
    <Box className={styles.tableTabsBoard}>
      <Box className={styles.tableTabsBoardControls}>
        <Input
          type="search"
          value={search}
          placeholder="Buscar por mesa ou nome"
          aria-label="Buscar comandas por mesa ou nome"
          className={styles.tableTabsBoardSearch}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Box
          direction="row"
          role="tablist"
          aria-label="Situação das comandas"
          className={`${motion.unroll} ${styles.tableTabsBoardGroups}`}
        >
          <Chip
            variant="tab"
            selected={group === 'active'}
            onClick={() => setGroup('active')}
          >
            Em aberto ({activeTabs.length})
          </Chip>
          <Chip
            variant="tab"
            selected={group === 'finalized'}
            onClick={() => setGroup('finalized')}
          >
            Finalizadas ({finalizedTabs.length})
          </Chip>
        </Box>
      </Box>

      <Box className={styles.tableTabsBoardScroll}>
        {isPending && <TableTabsListSkeleton />}
        {isError && (
          <Alert variant="error">
            Não foi possível carregar as comandas. Tente novamente.
          </Alert>
        )}
        {!isPending && !isError && visibleTabs.length === 0 && (
          <EmptyState
            size="md"
            illustration={isSearching ? undefined : <NinoMascot />}
            className={motion.settle}
          >
            {emptyMessage}
          </EmptyState>
        )}
        {!isPending && !isError && visibleTabs.length > 0 && (
          <Box
            key={group}
            as="ul"
            className={`${motion.unroll} ${styles.tableTabsBoardList}`}
          >
            {visibleTabs.map((tab) => (
              <TableTabCard key={tab.id} tab={tab} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
