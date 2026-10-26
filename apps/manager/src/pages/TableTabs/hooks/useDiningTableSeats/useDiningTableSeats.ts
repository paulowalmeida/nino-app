import { diningTableSeats } from '@pages/TableTabs/utils/diningTableSeats/diningTableSeats'
import { useDiningTables } from '@shared/hooks/dining-table/useDiningTables/useDiningTables'
import type { Tab } from '@shared/types/tab/tab.type'

export const useDiningTableSeats = (unitId: string | null, activeTabs: Tab[]) => {
  const { tables, isPending } = useDiningTables(unitId)
  return {
    seats: diningTableSeats(tables, activeTabs),
    isLoadingSeats: isPending,
  }
}
