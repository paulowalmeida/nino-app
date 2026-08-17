import type { StaffDetail } from '@custom_types/team/staff-detail'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './CollaboratorSummary.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const cancellationShare = (member: StaffDetail): string =>
  member.statusChanges === 0
    ? 'Nenhum cancelamento'
    : `${member.cancellations} de ${member.statusChanges} mudanças ` +
      'foram cancelamento'

const workSpan = (member: StaffDetail): string =>
  member.firstActivityAt
    ? `Tocando em pedido desde ${day.format(new Date(member.firstActivityAt))}`
    : 'Ainda não tocou em nenhum pedido'

type CollaboratorSummaryProps = {
  member: StaffDetail
}

export const CollaboratorSummary = ({ member }: CollaboratorSummaryProps) => (
  <section aria-label="Resumo do trabalho" className={styles.strip}>
    <dl className={styles.facts}>
      {[
        ['Vendido no balcão', brl(member.revenueHandled)],
        ['Pedidos no balcão', String(member.ordersHandled)],
        ['Mudanças de pedido', String(member.statusChanges)],
      ].map(([label, value], index) => (
        <div
          key={label}
          className={`${motion.settle} ${styles.fact}`}
          style={riseDelay(index * 60 + 120)}
        >
          <dt className={styles.factLabel}>{label}</dt>
          <dd className={styles.factValue}>{value}</dd>
        </div>
      ))}
    </dl>

    <p className={styles.footnote}>
      {workSpan(member)}
      {' · '}
      {cancellationShare(member)}
    </p>
  </section>
)
