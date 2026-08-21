import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { CollaboratorLoginAccess } from '@molecules/CollaboratorLoginAccess/CollaboratorLoginAccess'
import { CollaboratorRemovalAccess } from '@molecules/CollaboratorRemovalAccess/CollaboratorRemovalAccess'
import { CollaboratorRoleAccess } from '@molecules/CollaboratorRoleAccess/CollaboratorRoleAccess'
import type { StaffDetail } from '@custom_types/team/staff-detail'
import type { TenantRole } from '@custom_types/auth/tenant-role'
import { loginEmailOf } from '@utils/login-email'

import styles from './CollaboratorAccess.module.css'

type CollaboratorAccessProps = {
  member: StaffDetail
  roleLockHint?: string
  isChangingRole: boolean
  onChangeRole: (role: TenantRole) => void
  removalLockHint?: string
  onOpenEmailModal: () => void
  onOpenRemovalConfirm: () => void
}

export const CollaboratorAccess = ({
  member,
  roleLockHint,
  isChangingRole,
  onChangeRole,
  removalLockHint,
  onOpenEmailModal,
  onOpenRemovalConfirm,
}: CollaboratorAccessProps) => {
  const email = loginEmailOf(member.user)
  const firstName = member.user.name.split(' ')[0]

  return (
    <Box
      as="section"
      gap={6}
      grow
      aria-label="Acesso"
      className={styles.access}
    >
      {!member.user.profileCompletedAt && (
        <Alert variant="warning">
          Convite ainda não aceito. {firstName} só entra no painel depois de
          criar a senha pelo link do convite.
        </Alert>
      )}

      {!member.user.isActive && (
        <Alert variant="error">
          A conta está desativada. Nem o cargo nem o e-mail abaixo dão acesso ao
          painel enquanto ela estiver assim.
        </Alert>
      )}

      <CollaboratorRoleAccess
        role={member.role}
        roleLockHint={roleLockHint}
        isChangingRole={isChangingRole}
        onChangeRole={onChangeRole}
      />

      <CollaboratorLoginAccess
        email={email}
        onOpenEmailModal={onOpenEmailModal}
      />

      <CollaboratorRemovalAccess
        firstName={firstName}
        removalLockHint={removalLockHint}
        onOpenRemovalConfirm={onOpenRemovalConfirm}
      />
    </Box>
  )
}
