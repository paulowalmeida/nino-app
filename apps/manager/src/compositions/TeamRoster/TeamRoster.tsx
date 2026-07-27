import { Badge } from '@nino/ds/components/Badge'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { PersonMark } from '@components/PersonMark'
import { riseDelay } from '@utils/rise-delay'

import type { TeamRosterProps } from './TeamRoster.types'

import styles from './TeamRoster.module.css'
import motion from '@styles/motion.module.css'

export const TeamRoster = ({
  title,
  hint,
  entries,
  empty,
  isPending,
  removingId,
  onRemove,
  onEditEmail,
}: TeamRosterProps) => (
  <section className={styles.roster}>
    <header className={`${motion.unroll} ${styles.head}`}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.hint}>{hint}</p>
    </header>

    {isPending && (
      <div className={styles.loading}>
        <Skeleton className={styles.skeletonRow} />
        <Skeleton className={styles.skeletonRow} />
      </div>
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
            </div>

            <Badge variant="info">{entry.role}</Badge>

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
