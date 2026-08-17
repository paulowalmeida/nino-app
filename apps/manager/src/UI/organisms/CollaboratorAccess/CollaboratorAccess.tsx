import { TEAM_ROLE_LABEL, TEAM_ROLE_OPTIONS } from '@constants/team.constants'
import type { StaffDetail } from '@custom_types/team/staff-detail'
import { lastSeenLabel } from '@utils/last-seen'
import { loginEmailOf } from '@utils/login-email'
import { riseDelay } from '@utils/rise-delay'

import styles from './CollaboratorAccess.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const roleHint = (member: StaffDetail): string =>
  TEAM_ROLE_OPTIONS.find(({ value }) => value === member.role)?.hint ??
  'Sem permissão descrita'

const signupLabel = (member: StaffDetail): string =>
  member.user.profileCompletedAt
    ? `Concluído em ${day.format(new Date(member.user.profileCompletedAt))}`
    : 'Convite ainda não aceito'

const activityLabel = (iso: string | null): string =>
  iso ? day.format(new Date(iso)) : 'Nenhuma ainda'

type CollaboratorAccessProps = {
  member: StaffDetail
}

export const CollaboratorAccess = ({ member }: CollaboratorAccessProps) => (
  <section aria-label="Acesso" className={styles.access}>
    <div className={`${motion.settle} ${styles.role}`}>
      <p className={styles.roleName}>
        {TEAM_ROLE_LABEL[member.role] ?? member.role}
      </p>
      <p className={styles.roleHint}>{roleHint(member)}</p>
    </div>

    <dl className={styles.facts}>
      {[
        ['E-mail de acesso', loginEmailOf(member.user) ?? 'Sem e-mail'],
        ['Conta', member.user.isActive ? 'Ativa' : 'Desativada'],
        ['Cadastro', signupLabel(member)],
        ['Na equipe desde', day.format(new Date(member.createdAt))],
        ['Primeiro pedido tocado', activityLabel(member.firstActivityAt)],
        ['Última atividade', lastSeenLabel(member.lastActivityAt)],
      ].map(([label, value], index) => (
        <div
          key={label}
          className={`${motion.settle} ${styles.fact}`}
          style={riseDelay(index * 40 + 60)}
        >
          <dt className={styles.factLabel}>{label}</dt>
          <dd className={styles.factValue}>{value}</dd>
        </div>
      ))}
    </dl>
  </section>
)
