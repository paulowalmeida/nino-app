import { useParams } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Breadcrumb } from '@components/Breadcrumb'
import { PersonMark } from '@components/PersonMark'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useStaffDetail } from '@hooks/team/useStaffDetail'
import { lastSeenLabel } from '@utils/last-seen'
import { STATUS_LABEL, ticketNumber } from '@utils/order-flow'
import { formatPhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'

import styles from './CollaboratorDetail.module.css'
import motion from '@styles/motion.module.css'

const ROLE_LABEL: Record<string, string> = {
  TENANT_OWNER: 'Dono',
  MANAGER: 'Gerente',
  STAFF: 'Atendente',
}

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/* mês abreviado, mesma régua da ficha do cliente: "14 de jul. de 2026" cabe
   numa linha da coluna de resumo sem quebrar */
const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/** "Nunca entrou" fala de login; aqui a ausência é outra coisa — sem trabalho. */
const lastActivityLabel = (iso: string | null): string =>
  iso ? lastSeenLabel(iso) : 'Nenhuma ainda'

/**
 * A ficha do colaborador é feita do rastro que ele já deixa no sistema — quem
 * abriu no balcão vira `operatorId`, quem move o status vira `changedById`.
 * Nada aqui é inventado: é o mesmo trabalho que a cozinha e o balcão já
 * registram, só que lido pelo ângulo da pessoa em vez do pedido.
 */
export const CollaboratorDetail = () => {
  const { userId } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: member, isPending } = useStaffDetail(
    tenantId,
    userId as string
  )

  if (isPending) return <Skeleton className={styles.skeleton} />

  if (!member) {
    return (
      <div className={styles.page}>
        <Breadcrumb trail={[{ label: 'Equipe', to: '..' }, { label: '—' }]} />
        <EmptyState className={styles.empty}>
          Esta pessoa não está mais nesta loja.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb
        trail={[{ label: 'Equipe', to: '..' }, { label: member.user.name }]}
      />

      <p className={styles.eyebrow}>Equipe</p>

      <header className={`${motion.settle} ${styles.hero}`}>
        <PersonMark name={member.user.name} className={styles.mark} />

        <div className={styles.heroText}>
          <h1 className={styles.name}>{member.user.name}</h1>

          <div className={styles.contact}>
            {member.user.phone && (
              <a
                href={`tel:${member.user.phone}`}
                className={styles.email}
              >
                {formatPhone(member.user.phone)}
              </a>
            )}
          </div>
        </div>

        <Badge variant="info" className={styles.role}>
          {ROLE_LABEL[member.role] ?? member.role}
        </Badge>
      </header>

      <div className={styles.body}>
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

        <section className={styles.activity} aria-label="Atividade recente">
          <div className={styles.activityHead}>
            <h2 className={styles.activityTitle}>Atividade recente</h2>
            <p className={styles.activityHint}>Últimas 30 mudanças</p>
          </div>

          {member.activity.length === 0 ? (
            <EmptyState className={styles.empty}>
              Nenhum pedido passou pela mão desta pessoa ainda.
            </EmptyState>
          ) : (
            <ScrollArea className={styles.listScroll}>
              <ul className={styles.entries}>
                {member.activity.map((entry, index) => (
                  <li
                    key={entry.id}
                    className={`${motion.deal} ${styles.entry}`}
                    style={riseDelay(index * 30 + 80)}
                  >
                    <div className={styles.entryRow}>
                      <span className={styles.entryTicket}>
                        #{ticketNumber(entry.orderId)}
                      </span>
                      <span className={styles.entryStatus}>
                        {STATUS_LABEL[entry.status]}
                      </span>
                      <time
                        className={styles.entryAt}
                        dateTime={entry.createdAt}
                      >
                        {stamp.format(new Date(entry.createdAt))}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </section>
      </div>
    </div>
  )
}
