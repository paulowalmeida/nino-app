import { useParams } from 'react-router'

import { useCollaboratorDetailAdmin } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailAdmin/useCollaboratorDetailAdmin'
import { useCollaboratorDetailQuery } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailQuery/useCollaboratorDetailQuery'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useCollaboratorDetailFacade = () => {
  const { userId = '' } = useParams()
  const unit = useCurrentUnit()
  const unitId = unit?.unitId ?? null
  const detailQuery = useCollaboratorDetailQuery(unitId, userId)
  const admin = useCollaboratorDetailAdmin(
    unitId,
    unit?.role ?? null,
    detailQuery.data ?? null
  )

  return {
    member: detailQuery.data,
    isPending: detailQuery.isPending,
    isError: detailQuery.isError,
    roleLockHint: admin.roleLockHint,
    emailLockHint: admin.emailLockHint,
    changeRole: admin.changeRole,
    isChangingRole: admin.isChangingRole,
    saveEmail: admin.saveEmail,
    removalLockHint: admin.removalLockHint,
    confirmRemoval: admin.confirmRemoval,
    isRemoving: admin.isRemoving,
  }
}
