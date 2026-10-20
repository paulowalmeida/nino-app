import type { DiningTableSeat } from '@pages/TableTabs/types/DiningTableSeat.type'
import type { DiningTable } from '@shared/types/settings/dining-table'
import type { Tab } from '@shared/types/tab/tab.type'

export const diningTableSeats = (
  tables: DiningTable[],
  activeTabs: Tab[]
): DiningTableSeat[] => {
  const openTabIdByTable = new Map(
    activeTabs
      .filter((tab) => tab.diningTableId !== null)
      .map((tab) => [tab.diningTableId, tab.id])
  )
  return tables
    .filter((table) => table.isActive)
    .map((table) => ({
      id: table.id,
      name: table.name,
      openTabId: openTabIdByTable.get(table.id) ?? null,
    }))
}
