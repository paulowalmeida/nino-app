import { useParams } from 'react-router'

import { useCollaboratorDetailAdmin } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailAdmin/useCollaboratorDetailAdmin'
import { useCollaboratorDetailQuery } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailQuery/useCollaboratorDetailQuery'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useUnitPositions } from '@shared/hooks/team/useUnitPositions/useUnitPositions'

export const useCollaboratorDetailFacade = () => {
  const { userId = '' } = useParams()
  const unit = useCurrentUnit()
  const unitId = unit?.unitId ?? null
  const detailQuery = useCollaboratorDetailQuery(unitId, userId)
  const positionsQuery = useUnitPositions(unitId)
  const admin = useCollaboratorDetailAdmin(
    unitId,
    unit?.role ?? null,
    detailQuery.data ?? null,
    positionsQuery.data ?? [],
    unit?.positionLevel ?? 0
  )

  return {
    member: detailQuery.data,
    isPending: detailQuery.isPending,
    isError: detailQuery.isError,
    canChangePosition: admin.canChangePosition,
    promotionOptions: admin.promotionOptions,
    emailLockHint: admin.emailLockHint,
    changePosition: admin.changePosition,
    isChangingPosition: admin.isChangingPosition,
    saveEmail: admin.saveEmail,
    removalLockHint: admin.removalLockHint,
    confirmRemoval: admin.confirmRemoval,
    isRemoving: admin.isRemoving,
  }
}
