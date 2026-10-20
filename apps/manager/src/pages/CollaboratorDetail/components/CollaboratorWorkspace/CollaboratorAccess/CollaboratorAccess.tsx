import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import type { StaffDetail } from '@shared/types/team/staff-detail'
import type { UnitPosition } from '@shared/types/team/unit-position.type'
import { loginEmailOf } from '@shared/utils/login-email/login-email'

import { CollaboratorLoginAccess } from './CollaboratorLoginAccess/CollaboratorLoginAccess'
import { CollaboratorRemovalAccess } from './CollaboratorRemovalAccess/CollaboratorRemovalAccess'
import { CollaboratorRoleAccess } from './CollaboratorRoleAccess/CollaboratorRoleAccess'

import styles from './CollaboratorAccess.module.css'

type CollaboratorAccessProps = {
  member: StaffDetail
  canChangePosition: boolean
  promotionOptions: UnitPosition[]
  isChangingPosition: boolean
  onChangePosition: (positionId: string) => void
  removalLockHint?: string
  emailLockHint?: string
  onOpenEmailModal: () => void
  onOpenRemovalConfirm: () => void
}

export const CollaboratorAccess = ({
  member,
  canChangePosition,
  promotionOptions,
  isChangingPosition,
  onChangePosition,
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

      {canChangePosition && (
        <CollaboratorRoleAccess
          current={member.position}
          promotionOptions={promotionOptions}
          isChangingPosition={isChangingPosition}
          onChangePosition={onChangePosition}
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
