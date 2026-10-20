import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import type { StaffPosition } from '@shared/types/team/staff-position.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

import styles from './CollaboratorRoleAccess.module.css'

const ROLE_LABEL_ID = 'collaborator-role-choice'

type CollaboratorRoleAccessProps = {
  current: StaffPosition
  promotionOptions: UnitPosition[]
  isChangingPosition: boolean
  onChangePosition: (positionId: string) => void
}

export const CollaboratorRoleAccess = ({
  current,
  promotionOptions,
  isChangingPosition,
  onChangePosition,
}: CollaboratorRoleAccessProps) => {
  const options = [
    { value: current.id, label: current.name, description: 'Cargo atual' },
    ...promotionOptions.map(({ id, name }) => ({ value: id, label: name })),
  ]

  return (
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
        options={options}
        value={current.id}
        disabled={isChangingPosition}
        onValueChange={(value) => value !== current.id && onChangePosition(value)}
        aria-labelledby={ROLE_LABEL_ID}
        className={styles.choice}
      />
    </Box>
  )
}
