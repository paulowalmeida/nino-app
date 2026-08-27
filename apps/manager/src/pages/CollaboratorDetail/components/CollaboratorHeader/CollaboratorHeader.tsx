import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'
import { TEAM_ROLE_LABEL } from '@shared/constants/team.constants'
import type { StaffDetail } from '@shared/types/team/staff-detail'
import { lastSeenLabel } from '@shared/utils/last-seen/last-seen'

import motion from '@styles/motion.module.css'
import styles from './CollaboratorHeader.module.css'

const monthYear = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
})

type CollaboratorHeaderProps = {
  member: StaffDetail
}

export const CollaboratorHeader = ({ member }: CollaboratorHeaderProps) => (
  <Box
    as="header"
    direction="row"
    gap={4}
    align="center"
    className={`${motion.settle} ${styles.hero}`}
  >
    <PersonMark name={member.user.name} className={styles.mark} />

    <Box className={styles.heroText}>
      <Eyebrow>Equipe</Eyebrow>
      <Heading level={1} size="xl" className={styles.name}>
        {member.user.name}
      </Heading>
      <Text className={styles.cadence}>
        {TEAM_ROLE_LABEL[member.role] ?? member.role}
        {' · '}
        Na equipe desde {monthYear.format(new Date(member.createdAt))}
        {' · '}
        {lastSeenLabel(member.user.lastLoginAt)}
      </Text>
    </Box>

    {!member.user.isActive && (
      <Badge variant="error" className={styles.status}>
        Acesso desativado
      </Badge>
    )}
  </Box>
)
