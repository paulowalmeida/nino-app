import { useParams } from 'react-router'

import { useCollaboratorDetailAdmin } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailAdmin/useCollaboratorDetailAdmin'
import { useCollaboratorDetailQuery } from '@pages/CollaboratorDetail/hooks/useCollaboratorDetailQuery/useCollaboratorDetailQuery'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useCollaboratorDetailFacade = () => {
  const { userId = '' } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const detailQuery = useCollaboratorDetailQuery(tenantId, userId)
  const admin = useCollaboratorDetailAdmin(
    tenantId,
    tenant?.role ?? null,
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
