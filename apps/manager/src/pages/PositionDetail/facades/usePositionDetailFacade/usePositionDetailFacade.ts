import { useParams } from 'react-router'

import { usePositionDetailActions } from '@pages/PositionDetail/hooks/usePositionDetailActions/usePositionDetailActions'
import { usePositionDetailQuery } from '@pages/PositionDetail/hooks/usePositionDetailQuery/usePositionDetailQuery'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { usePositionPermissions } from '@shared/hooks/team/usePositionPermissions/usePositionPermissions'

export const usePositionDetailFacade = () => {
  const { positionId } = useParams()
  const unitId = useCurrentUnit()?.unitId ?? null
  const detail = usePositionDetailQuery(unitId, positionId)
  const permissionsQuery = usePositionPermissions(unitId)
  const actions = usePositionDetailActions(unitId, positionId)

  return {
    isCreating: !positionId,
    position: detail.position,
    positions: detail.positions,
    isPending: detail.isPending,
    isError: detail.isError,
    permissionCatalog: permissionsQuery.data ?? [],
    savePosition: actions.save,
    renamePosition: actions.rename,
    duplicatePosition: actions.duplicate,
    isDuplicating: actions.isDuplicating,
    removePosition: actions.remove,
  }
}
