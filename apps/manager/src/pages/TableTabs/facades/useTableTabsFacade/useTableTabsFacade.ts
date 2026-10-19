import { useOpenTab } from '@pages/TableTabs/hooks/useOpenTab/useOpenTab'
import { useTabBoard } from '@pages/TableTabs/hooks/useTabBoard/useTabBoard'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useTableTabsFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const board = useTabBoard(unitId)
  const opening = useOpenTab(unitId)

  return {
    activeTabs: board.activeTabs,
    finalizedTabs: board.finalizedTabs,
    isPending: board.isPending,
    isError: board.isError,
    submitOpen: opening.submitOpen,
    isOpening: opening.isOpening,
  }
}
