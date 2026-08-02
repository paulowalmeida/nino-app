import { Badge } from '@nino/ds/components/Badge'
import { Menu } from '@nino/ds/components/Menu'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { NavIcon } from '@components/NavIcon'
import { PersonMark } from '@components/PersonMark'
import { lastSeenLabel } from '@utils/last-seen'
import { riseDelay } from '@utils/rise-delay'

import type { TeamRosterProps } from './TeamRoster.types'

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
}: TeamRosterProps) => (
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

    {!isPending && entries.length === 0 && (
      <EmptyState>{empty}</EmptyState>
    )}

    {entries.length > 0 && (
      <ul className={styles.list}>
        {entries.map((entry, index) => (
          <li
            key={entry.id}
            className={`${motion.deal} ${styles.row}`}
            style={riseDelay(index * 50 + 60)}
          >
            <PersonMark
              name={entry.name}
              tone={entry.quiet ? 'quiet' : 'brand'}
            />

            <div className={styles.person}>
              <p className={styles.name}>{entry.name}</p>
              {entry.email && <p className={styles.email}>{entry.email}</p>}
              <p
                className={
                  entry.lastLoginAt ? styles.lastSeen : styles.neverSeen
                }
              >
                Último acesso: {lastSeenLabel(entry.lastLoginAt)}
              </p>
            </div>

            {onChangeRole && entry.roleKey && !entry.roleLocked ? (
              <Menu
                contentClassName={styles.rolePanel}
                trigger={
                  <button
                    type="button"
                    className={styles.roleTrigger}
                    disabled={changingRoleId === entry.id}
                  >
                    <Badge variant="info">{entry.role}</Badge>
                    <NavIcon name="chevron" className={styles.roleCaret} />
                  </button>
                }
                items={ROLE_OPTIONS.map(({ value, label, hint }) => ({
                  value,
                  label: `${label} — ${hint}`,
                  disabled: entry.roleKey === value,
                  onSelect: () => onChangeRole(entry.id, value),
                }))}
              />
            ) : (
              <Badge variant="info" title={entry.roleLocked}>
                {entry.role}
              </Badge>
            )}

            <div className={styles.actions}>
              {entry.emailEditable && onEditEmail && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={motion.press}
                  onClick={() => onEditEmail(entry.id)}
                >
                  Editar e-mail
                </Button>
              )}

              {entry.removable && (
                <Button
                  variant="ghost"
                  size="sm"
                  loading={removingId === entry.id}
                  className={`${motion.press} ${styles.remove}`}
                  onClick={() => onRemove(entry.id)}
                >
                  Tirar da loja
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
)
