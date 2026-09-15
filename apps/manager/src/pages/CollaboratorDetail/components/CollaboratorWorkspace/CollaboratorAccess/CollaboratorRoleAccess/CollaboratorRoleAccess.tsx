import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import { TEAM_ROLE_OPTIONS } from '@shared/constants/team.constants'
import type { UnitRole } from '@shared/types/auth/unit-role'

import styles from './CollaboratorRoleAccess.module.css'

const ROLE_REACH = TEAM_ROLE_OPTIONS.map(({ value, label, hint }) => ({
  value,
  label,
  description: hint,
}))

const ROLE_LABEL_ID = 'collaborator-role-choice'

const isUnitRole = (value: string): value is UnitRole =>
  TEAM_ROLE_OPTIONS.some((option) => option.value === value)

type CollaboratorRoleAccessProps = {
  role: UnitRole
  roleLockHint?: string
  isChangingRole: boolean
  onChangeRole: (role: UnitRole) => void
}

export const CollaboratorRoleAccess = ({
  role,
  roleLockHint,
  isChangingRole,
  onChangeRole,
}: CollaboratorRoleAccessProps) => (
  <section aria-labelledby={ROLE_LABEL_ID}>
    <Heading
      level={3}
      size="sm"
      color="faintest"
      id={ROLE_LABEL_ID}
      className={styles.title}
    >
      Até onde vai nesta loja
    </Heading>

    <RadioGroup
      variant="card"
      options={ROLE_REACH}
      value={role}
      disabled={!!roleLockHint || isChangingRole}
      onValueChange={(value) => isUnitRole(value) && onChangeRole(value)}
      aria-labelledby={ROLE_LABEL_ID}
      className={styles.choice}
    />

    {roleLockHint && (
      <Box direction="row" align="center" gap={1.5}>
        <Icon name="lock" size="sm" aria-hidden className='mt-3'/>
        <Text as="span" size="xs" color="faint" mt={3}>
          {roleLockHint}
        </Text>
      </Box>
    )}
  </section>
)
