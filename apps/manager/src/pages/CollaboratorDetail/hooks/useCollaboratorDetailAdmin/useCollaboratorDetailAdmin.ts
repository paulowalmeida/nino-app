import { useNavigate } from 'react-router'

import { useRemoveMember } from '@shared/hooks/team/useRemoveMember/useRemoveMember'
import { useUpdateStaffEmail } from '@shared/hooks/team/useUpdateStaffEmail/useUpdateStaffEmail'
import { useUpdateStaffRole } from '@shared/hooks/team/useUpdateStaffRole/useUpdateStaffRole'
import { useSessionStore } from '@shared/states/session/session.state'
import type { UnitRole } from '@shared/types/auth/unit-role'
import type { StaffDetail } from '@shared/types/team/staff-detail'

const OWNER_ONLY_HINT = 'Só o dono da loja muda o cargo de alguém.'
const SELF_HINT = 'Você não pode mudar o próprio cargo.'
const OWNER_TARGET_HINT = 'Rebaixe o dono antes de removê-lo da loja.'

export const useCollaboratorDetailAdmin = (
  unitId: string | null,
  unitRole: UnitRole | null,
  member: StaffDetail | null
) => {
  const navigate = useNavigate()
  const signedInUserId = useSessionStore((state) => state.user?.id)

  const { mutate: changeRole, isPending: isChangingRole } =
    useUpdateStaffRole(unitId)
  const { mutateAsync: updateEmail } = useUpdateStaffEmail(unitId)
  const { mutateAsync: removeMember, isPending: isRemoving } =
    useRemoveMember(unitId)

  const memberUserId = member?.user.id ?? ''
  const isSelf = memberUserId === signedInUserId
  const isOwnerSignedIn = unitRole === 'UNIT_OWNER'
  const isTargetOwner = member?.role === 'UNIT_OWNER'
  const roleLockHint = !isOwnerSignedIn
    ? OWNER_ONLY_HINT
    : isSelf
      ? SELF_HINT
      : undefined

  const confirmRemoval = async () => {
    await removeMember({ id: memberUserId, kind: 'STAFF' })
    void navigate('..')
  }

  return {
    saveEmail: (email: string) => updateEmail({ userId: memberUserId, email }),

    emailLockHint: !isOwnerSignedIn
      ? OWNER_ONLY_HINT
      : isSelf
        ? 'Altere seu próprio e-mail no perfil.'
        : isTargetOwner
          ? 'Rebaixe o dono antes de alterar seu e-mail.'
          : undefined,

    roleLockHint,
    changeRole: (role: UnitRole) =>
      changeRole({ userId: memberUserId, role }),
    isChangingRole,

    removalLockHint: !isOwnerSignedIn
      ? OWNER_ONLY_HINT
      : isSelf
        ? 'Você não pode se remover da loja.'
        : isTargetOwner
          ? OWNER_TARGET_HINT
          : undefined,
    confirmRemoval,
    isRemoving,
  }
}
