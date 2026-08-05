import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Icon } from '@nino/ds/components/Icon'
import { PersonMark } from '@components/PersonMark/PersonMark'
import type { TenantRole } from '@custom_types/auth/tenant-role'
import type { RosterEntry } from '@custom_types/team/roster-entry'
import { lastSeenLabel } from '@utils/last-seen'
import { riseDelay } from '@utils/rise-delay'

import styles from './TeamRoster.module.css'
import motion from '@styles/motion.module.css'

export type TeamRosterProps = {
  /** Enables switching roles. Only the store owner gets this. */
  onChangeRole?: (id: string, role: TenantRole) => void
  /** Row with a role change in progress. */
  changingRoleId?: string
  title: string
  hint: string
  entries: RosterEntry[]
  empty: string
  isPending?: boolean
  removingId?: string
  onRemove: (id: string) => void
  onEditEmail?: (id: string) => void
}

/**
 * What each role can do, said in one line: whoever changes it needs to know
 * what they're handing over, and "manager" alone doesn't explain anything.
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

/** Three people: a whole small team, which is the common case. */
const GHOST_ROWS = ['first', 'second', 'third']

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
   * One menu per person, not three controls fighting for the same row:
   * changing role, editing e-mail and removing from the store are the same
   * question — "what to do with this person" — and the width budget is
   * what works on any screen, from mobile to desktop, without needing a
   * different layout per size.
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

      {/* the same list, with the people yet to arrive: avatar, name, e-mail,
          role */}
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
            const isBusy =
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
                          entry.lastLoginAt ? styles.lastSeen : styles.neverSeen
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
                          entry.lastLoginAt ? styles.lastSeen : styles.neverSeen
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
                        disabled={isBusy}
                        aria-label={`Ações para ${entry.name}`}
                      >
                        <Icon name="kebab" />
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
