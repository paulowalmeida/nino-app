import { useTabs } from '@pages/TableTabs/hooks/useTabs/useTabs'
import {
  ACTIVE_TAB_STATUSES,
  FINALIZED_TAB_STATUSES,
} from '@shared/constants/tab.constants'

export const useTabBoard = (unitId: string | null) => {
  const active = useTabs(unitId, ACTIVE_TAB_STATUSES)
  const finalized = useTabs(unitId, FINALIZED_TAB_STATUSES)

  return {
    activeTabs: active.tabs,
    finalizedTabs: finalized.tabs,
    isPending: active.isPending || finalized.isPending,
    isError: active.isError || finalized.isError,
  }
}
