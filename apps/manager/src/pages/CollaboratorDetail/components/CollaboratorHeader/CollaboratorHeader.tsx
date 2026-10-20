import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Header } from '@nino/ds/components/Header'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'
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
    className={`${motion.deal} ${styles.hero}`}
  >
    <PersonMark name={member.user.name} className={styles.mark} />

    <Box className={styles.heroText}>
      <Eyebrow>Equipe</Eyebrow>
      <Header
        level={1}
        size="xl"
        title={member.user.name}
        description={`${member.position.name} · Na equipe desde ${monthYear.format(new Date(member.createdAt))} · ${lastSeenLabel(member.user.lastLoginAt)}`}
      />
    </Box>

    {!member.user.isActive && (
      <Badge variant="error" className={styles.collaboratorHeaderStatus}>
        Acesso desativado
      </Badge>
    )}
  </Box>
)
