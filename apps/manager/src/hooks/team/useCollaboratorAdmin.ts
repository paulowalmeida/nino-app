import { useState } from 'react'
import { useNavigate } from 'react-router'

import type { StaffDetail } from '@custom_types/team/staff-detail'
import type { TenantRole } from '@custom_types/auth/tenant-role'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useRemoveMember } from '@hooks/team/useRemoveMember'
import { useUpdateStaffEmail } from '@hooks/team/useUpdateStaffEmail'
import { useUpdateStaffRole } from '@hooks/team/useUpdateStaffRole'
import { useSessionStore } from '@states/useSessionStore'

const OWNER_ONLY_HINT = 'Só o dono da loja muda o cargo de alguém.'
const SELF_HINT = 'Você não pode mudar o próprio cargo.'
const LAST_OWNER_HINT = 'A loja precisa de um dono — passe o cargo antes.'

export const useCollaboratorAdmin = (member: StaffDetail) => {
  const [isEmailModalOpen, setEmailModalOpen] = useState(false)
  const [isRemovalConfirmOpen, setRemovalConfirmOpen] = useState(false)

  const navigate = useNavigate()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const signedInUserId = useSessionStore((state) => state.user?.id)

  const { mutate: changeRole, isPending: isChangingRole } =
    useUpdateStaffRole(tenantId)
  const { mutateAsync: updateEmail } = useUpdateStaffEmail(tenantId)
  const { mutateAsync: removeMember, isPending: isRemoving } =
    useRemoveMember(tenantId)

  const isSelf = member.user.id === signedInUserId
  const isOwnerSignedIn = tenant?.role === 'TENANT_OWNER'
  const isMemberOwner = member.role === 'TENANT_OWNER'

  const roleLockHint = !isOwnerSignedIn
    ? OWNER_ONLY_HINT
    : isSelf
      ? SELF_HINT
      : undefined

  const confirmRemoval = async () => {
    await removeMember({ id: member.user.id, kind: 'STAFF' })
    setRemovalConfirmOpen(false)
    void navigate('..')
  }

  return {
    isEmailModalOpen,
    openEmailModal: () => setEmailModalOpen(true),
    closeEmailModal: () => setEmailModalOpen(false),
    saveEmail: (email: string) =>
      updateEmail({ userId: member.user.id, email }),

    roleLockHint,
    changeRole: (role: TenantRole) =>
      changeRole({ userId: member.user.id, role }),
    isChangingRole,

    removalLockHint: isMemberOwner ? LAST_OWNER_HINT : undefined,
    isRemovalConfirmOpen,
    openRemovalConfirm: () => setRemovalConfirmOpen(true),
    closeRemovalConfirm: () => setRemovalConfirmOpen(false),
    confirmRemoval,
    isRemoving,
  }
}
