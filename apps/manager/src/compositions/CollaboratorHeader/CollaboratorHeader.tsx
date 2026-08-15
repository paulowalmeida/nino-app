import { TEAM_ROLE_LABEL } from '@constants/team.constants'
import type { StaffDetail } from '@custom_types/team/staff-detail'
import { PersonMark } from '@elements/PersonMark/PersonMark'
import { Badge } from '@nino/ds/components/Badge'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { formatPhone } from '@utils/phone'

import { Header } from '@ds/components/Header/Header'
import motion from '@styles/motion.module.css'
import styles from './CollaboratorHeader.module.css'

type CollaboratorHeaderProps = {
  member: StaffDetail
}

export const CollaboratorHeader = ({ member }: CollaboratorHeaderProps) => (
  <Flexbox as="header" gap={4} align="center" mt={1} className={motion.settle}>
    <PersonMark name={member.user.name} className={styles.mark} />

    <Flexbox className={styles.heroText}>
      <Header title={member.user.name} level={1}></Header>

      <Flexbox className={styles.contact}>
        {member.user.phone && (
          <a href={`tel:${member.user.phone}`} className={styles.email}>
            {formatPhone(member.user.phone)}
          </a>
        )}
      </Flexbox>
    </Flexbox>

    <Badge variant="info" className={styles.role}>
      {TEAM_ROLE_LABEL[member.role] ?? member.role}
    </Badge>
  </Flexbox>
)
