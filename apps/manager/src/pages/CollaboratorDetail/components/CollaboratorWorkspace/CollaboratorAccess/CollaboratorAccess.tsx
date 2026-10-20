import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import type { UnitRole } from '@shared/types/auth/unit-role'
import type { StaffDetail } from '@shared/types/team/staff-detail'
import { loginEmailOf } from '@shared/utils/login-email/login-email'

import { CollaboratorLoginAccess } from './CollaboratorLoginAccess/CollaboratorLoginAccess'
import { CollaboratorRemovalAccess } from './CollaboratorRemovalAccess/CollaboratorRemovalAccess'
import { CollaboratorRoleAccess } from './CollaboratorRoleAccess/CollaboratorRoleAccess'

import styles from './CollaboratorAccess.module.css'

type CollaboratorAccessProps = {
  member: StaffDetail
  canChangeRole: boolean
  isChangingRole: boolean
  onChangeRole: (role: UnitRole) => void
  removalLockHint?: string
  emailLockHint?: string
  onOpenEmailModal: () => void
  onOpenRemovalConfirm: () => void
}

export const CollaboratorAccess = ({
  member,
  canChangeRole,
  isChangingRole,
  onChangeRole,
  removalLockHint,
  emailLockHint,
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

      {canChangeRole && (
        <CollaboratorRoleAccess
          role={member.role}
          isChangingRole={isChangingRole}
          onChangeRole={onChangeRole}
        />
      )}

      <CollaboratorLoginAccess
        email={email}
        emailLockHint={emailLockHint}
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
