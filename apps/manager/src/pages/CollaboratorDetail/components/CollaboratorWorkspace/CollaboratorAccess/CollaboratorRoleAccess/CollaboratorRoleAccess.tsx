import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { TEAM_ROLE_OPTIONS } from '@shared/constants/team.constants'
import type { UnitRole } from '@shared/types/auth/unit-role'

import styles from './CollaboratorRoleAccess.module.css'

const PROMOTABLE_ROLES: UnitRole[] = ['STAFF', 'MANAGER']

const ROLE_REACH = TEAM_ROLE_OPTIONS.filter(({ value }) =>
  PROMOTABLE_ROLES.includes(value)
).map(({ value, label, hint }) => ({
  value,
  label,
  description: hint,
}))

const ROLE_LABEL_ID = 'collaborator-role-choice'

const isUnitRole = (value: string): value is UnitRole =>
  PROMOTABLE_ROLES.includes(value as UnitRole)

type CollaboratorRoleAccessProps = {
  role: UnitRole
  isChangingRole: boolean
  onChangeRole: (role: UnitRole) => void
}

export const CollaboratorRoleAccess = ({
  role,
  isChangingRole,
  onChangeRole,
}: CollaboratorRoleAccessProps) => (
  <Box as="section" aria-labelledby={ROLE_LABEL_ID}>
    <Heading
      level={3}
      size="sm"
      color="faintest"
      id={ROLE_LABEL_ID}
      className={styles.collaboratorRoleAccessTitle}
    >
      Cargo
    </Heading>

    <RadioGroup
      variant="card"
      options={ROLE_REACH}
      value={role}
      disabled={isChangingRole}
      onValueChange={(value) => isUnitRole(value) && onChangeRole(value)}
      aria-labelledby={ROLE_LABEL_ID}
      className={styles.choice}
    />
  </Box>
)
