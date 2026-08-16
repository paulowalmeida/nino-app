import type { StaffDetail } from '@custom_types/team/staff-detail'
import { lastSeenLabel } from '@utils/last-seen'
import { riseDelay } from '@utils/rise-delay'

import styles from './CollaboratorFacts.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const lastActivityLabel = (iso: string | null): string =>
  iso ? lastSeenLabel(iso) : 'Nenhuma ainda'

type CollaboratorFactsProps = {
  member: StaffDetail
}

export const CollaboratorFacts = ({ member }: CollaboratorFactsProps) => (
  <dl className={styles.facts}>
    {[
      ['Pedidos abertos no balcão', String(member.ordersHandled)],
      ['Última atividade', lastActivityLabel(member.lastActivityAt)],
      ['Na equipe desde', day.format(new Date(member.createdAt))],
    ].map(([label, value], index) => (
      <div
        key={label}
        className={`${motion.settle} ${styles.fact}`}
        style={riseDelay(index * 50 + 60)}
      >
        <dt className={styles.factLabel}>{label}</dt>
        <dd className={styles.factValue}>{value}</dd>
      </div>
    ))}
  </dl>
)
