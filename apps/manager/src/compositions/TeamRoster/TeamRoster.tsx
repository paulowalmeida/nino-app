import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { PersonMark } from '@components/PersonMark'
import { lastSeenLabel } from '@utils/last-seen'
import { riseDelay } from '@utils/rise-delay'

import type { RosterEntry, TeamRosterProps } from './TeamRoster.types'

import styles from './TeamRoster.module.css'
import motion from '@styles/motion.module.css'

/**
 * O que cada cargo pode fazer, dito em uma linha: quem troca precisa saber o
 * que está entregando, e "gerente" sozinho não explica nada.
 */
const ROLE_OPTIONS = [
  {
    value: 'TENANT_OWNER' as const,
    label: 'Dono',
    hint: 'Tudo, inclusive assinatura e equipe',
  },
  {
    value: 'MANAGER' as const,
    label: 'Gerente',
    hint: 'Dia a dia e configurações da loja',
  },
  {
    value: 'STAFF' as const,
    label: 'Atendente',
    hint: 'Vê e move pedidos',
  },
]

/** Três pessoas: uma equipe pequena inteira, que é o caso comum. */
const GHOST_ROWS = ['first', 'second', 'third']

const KebabIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
)

export const TeamRoster = ({
  title,
  hint,
  entries,
  empty,
  isPending,
  removingId,
  changingRoleId,
  onRemove,
  onEditEmail,
  onChangeRole,
}: TeamRosterProps) => {
  /*
   * Um menu só por pessoa, não três controles disputando a mesma linha:
   * trocar cargo, editar e-mail e tirar da loja são a mesma pergunta — "o que
   * fazer com esta pessoa" — e a régua de largura é o que dá certo em
   * qualquer tela, do celular ao desktop, sem precisar de layout diferente
   * para cada tamanho.
   */
  const actionsOf = (entry: RosterEntry): MenuItem[] => {
    const items: MenuItem[] = []
    const canChangeRole = onChangeRole && entry.roleKey && !entry.roleLocked

    if (canChangeRole) {
      items.push(
        ...ROLE_OPTIONS.map(({ value, label, hint: roleHint }) => ({
          value: `role-${value}`,
          label:
            entry.roleKey === value
              ? `${label} — atual`
              : `${label} — ${roleHint}`,
          disabled: entry.roleKey === value,
          onSelect: () => onChangeRole(entry.id, value),
        }))
      )
    }

    if (entry.emailEditable && onEditEmail) {
      if (items.length > 0) items.push({ separator: true })
      items.push({
        value: 'edit-email',
        label: 'Editar e-mail',
        onSelect: () => onEditEmail(entry.id),
      })
    }

    if (entry.removable) {
      if (items.length > 0) items.push({ separator: true })
      items.push({
        value: 'remove',
        label: 'Tirar da loja',
        destructive: true,
        onSelect: () => onRemove(entry.id),
      })
    }

    return items
  }

  return (
    <section className={styles.roster}>
      <header className={`${motion.unroll} ${styles.head}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.hint}>{hint}</p>
      </header>

      {/* a mesma lista, com as pessoas por chegar: disco, nome, e-mail, papel */}
      {isPending && (
        <ul className={styles.list}>
          {GHOST_ROWS.map((row) => (
            <li key={row} className={styles.row}>
              <Skeleton className={styles.ghostMark} />

              <div className={styles.person}>
                <Skeleton className={styles.ghostName} />
                <Skeleton className={styles.ghostEmail} />
              </div>

              <Skeleton className={styles.ghostRole} />
            </li>
          ))}
        </ul>
      )}

      {!isPending && entries.length === 0 && <EmptyState>{empty}</EmptyState>}

      {entries.length > 0 && (
        <ul className={styles.list}>
          {entries.map((entry, index) => {
            const items = actionsOf(entry)
            const busy =
              changingRoleId === entry.id || removingId === entry.id

            return (
              <li
                key={entry.id}
                className={`${motion.deal} ${styles.row}`}
                style={riseDelay(index * 50 + 60)}
              >
                {entry.href ? (
                  <Link to={entry.href} className={styles.identity}>
                    <PersonMark
                      name={entry.name}
                      tone={entry.quiet ? 'quiet' : 'brand'}
                    />

                    <div className={styles.person}>
                      <p className={styles.name}>{entry.name}</p>
                      {entry.email && (
                        <p className={styles.email}>{entry.email}</p>
                      )}
                      <p
                        className={
                          entry.lastLoginAt
                            ? styles.lastSeen
                            : styles.neverSeen
                        }
                      >
                        Último acesso: {lastSeenLabel(entry.lastLoginAt)}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className={styles.identity}>
                    <PersonMark
                      name={entry.name}
                      tone={entry.quiet ? 'quiet' : 'brand'}
                    />

                    <div className={styles.person}>
                      <p className={styles.name}>{entry.name}</p>
                      {entry.email && (
                        <p className={styles.email}>{entry.email}</p>
                      )}
                      <p
                        className={
                          entry.lastLoginAt
                            ? styles.lastSeen
                            : styles.neverSeen
                        }
                      >
                        Último acesso: {lastSeenLabel(entry.lastLoginAt)}
                      </p>
                    </div>
                  </div>
                )}

                <Badge
                  variant="info"
                  className={styles.roleBadge}
                  title={entry.roleLocked}
                >
                  {entry.role}
                </Badge>

                {items.length > 0 && (
                  <Menu
                    contentClassName={styles.menuPanel}
                    trigger={
                      <button
                        type="button"
                        className={styles.kebab}
                        disabled={busy}
                        aria-label={`Ações para ${entry.name}`}
                      >
                        <KebabIcon />
                      </button>
                    }
                    items={items}
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
