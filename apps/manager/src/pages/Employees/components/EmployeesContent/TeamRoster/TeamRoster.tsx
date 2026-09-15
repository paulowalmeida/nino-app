import { useState } from 'react'
import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { TEAM_ROSTER_GHOST_ROWS } from '@pages/Employees/constants/employees.constants'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'
import {
  TEAM_ROLE_OPTIONS,
} from '@shared/constants/team.constants'
import type { UnitRole } from '@shared/types/auth/unit-role'
import type { RosterEntry } from '@shared/types/team/roster-entry'
import { lastSeenLabel } from '@shared/utils/last-seen/last-seen'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './TeamRoster.module.css'

export type TeamRosterProps = {
  /** Enables switching roles. Only the store owner gets this. */
  onChangeRole?: (id: string, role: UnitRole) => void
  /** Row with a role change in progress. */
  changingRoleId?: string
  title: string
  hint: string
  entries: RosterEntry[]
  empty: string
  /** Enables filtering this group. Reads as the field's accessible name. */
  searchLabel?: string
  isPending?: boolean
  removingId?: string
  onRemove: (id: string) => void
  onEditEmail?: (id: string) => void
}

export const TeamRoster = ({
  title,
  hint,
  entries,
  empty,
  searchLabel,
  isPending,
  removingId,
  changingRoleId,
  onRemove,
  onEditEmail,
  onChangeRole,
}: TeamRosterProps) => {
  const [term, setTerm] = useState('')
  const query = term.trim().toLowerCase()

  /* The field is measured against the group it heads, never the filtered
     result — it must not vanish under the cursor when a search matches
     nobody. */
  const isSearchable = !!searchLabel && entries.length > 0

  const matches = (entry: RosterEntry): boolean =>
    entry.name.toLowerCase().includes(query) ||
    !!entry.email?.toLowerCase().includes(query)

  const visibleEntries = query ? entries.filter(matches) : entries

  const emptyMessage = query
    ? `Ninguém com "${term}". Tente outro nome ou e-mail.`
    : empty
  /*
   * The role pill is its own menu, not folded into the kebab: a plain badge
   * next to a generic "more actions" icon gave no hint that the role itself
   * was the thing you could click. A chevron on the pill borrows the same
   * cue `Select` already uses elsewhere in the DS for "this opens a list of
   * values" — closer to what changing a role actually is.
   */
  const roleItemsOf = (entry: RosterEntry): MenuItem[] => {
    if (!onChangeRole || !entry.roleKey || entry.roleLocked) return []

    return TEAM_ROLE_OPTIONS.map(({ value, label, hint: roleHint }) => ({
      value: `role-${value}`,
      label:
        entry.roleKey === value
          ? `${label} — atual`
          : `${label} — ${roleHint}`,
      disabled: entry.roleKey === value,
      onSelect: () => onChangeRole(entry.id, value),
    }))
  }

  /* Everything left is a generic action on the person, not on their role —
     these stay behind the kebab. */
  const otherItemsOf = (entry: RosterEntry): MenuItem[] => {
    const items: MenuItem[] = []

    if (entry.emailEditable && onEditEmail) {
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
        <div className={styles.headings}>
          <h2 className="sr-only">{title}</h2>
          <p className={styles.hint}>{hint}</p>
        </div>

        {isSearchable && (
          <Input
            type="search"
            value={term}
            placeholder="Nome ou e-mail"
            aria-label={searchLabel}
            className={styles.search}
            onChange={(event) => setTerm(event.target.value)}
          />
        )}
      </header>

      {/* the same list, with the people yet to arrive: avatar, name, e-mail,
          role */}
      {isPending && (
        <Box className={styles.tableShell}>
          <Table>
            <colgroup>
              <col className={styles.colPerson} />
              <col className={styles.colSeen} />
              <col className={styles.colRole} />
              <col className={styles.colActions} />
            </colgroup>
            <TableHeader>
              <TableRow className={styles.headRow}>
                <TableHead>Pessoa</TableHead>
                <TableHead>Último acesso</TableHead>
                <TableHead className={styles.colRight}>Papel</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {TEAM_ROSTER_GHOST_ROWS.map((row) => (
                <TableRow key={row}>
                  <TableCell>
                    <div className={styles.identityCell}>
                      <Skeleton className={styles.ghostMark} />
                      <div className={styles.person}>
                        <Skeleton className={styles.ghostName} />
                        <Skeleton className={styles.ghostEmail} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className={styles.ghostEmail} />
                  </TableCell>
                  <TableCell className={styles.colRight}>
                    <Skeleton className={styles.ghostRole} />
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {!isPending && visibleEntries.length === 0 && (
        <EmptyState>{emptyMessage}</EmptyState>
      )}

      {visibleEntries.length > 0 && (
        <Box className={styles.tableShell}>
          <Table>
            <colgroup>
              <col className={styles.colPerson} />
              <col className={styles.colSeen} />
              <col className={styles.colRole} />
              <col className={styles.colActions} />
            </colgroup>
            <TableHeader>
              <TableRow className={styles.headRow}>
                <TableHead>Pessoa</TableHead>
                <TableHead>Último acesso</TableHead>
                <TableHead className={styles.colRight}>Papel</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleEntries.map((entry, index) => {
                const roleItems = roleItemsOf(entry)
                const otherItems = otherItemsOf(entry)
                const isBusy =
                  changingRoleId === entry.id || removingId === entry.id
                const identity = (
                  <>
                    <PersonMark
                      name={entry.name}
                      tone={entry.quiet ? 'quiet' : 'brand'}
                    />

                    <div className={styles.person}>
                      <p className={styles.name}>{entry.name}</p>
                      {entry.email && (
                        <p className={styles.email}>{entry.email}</p>
                      )}
                    </div>
                  </>
                )

                return (
                  <TableRow
                    key={entry.id}
                    className={motion.deal}
                    style={riseDelay(index * 50 + 60)}
                  >
                    <TableCell>
                      {entry.href ? (
                        <Link to={entry.href} className={styles.identity}>
                          {identity}
                        </Link>
                      ) : (
                        <div className={styles.identityCell}>{identity}</div>
                      )}
                    </TableCell>

                    <TableCell
                      className={
                        entry.lastLoginAt ? styles.lastSeen : styles.neverSeen
                      }
                    >
                      {lastSeenLabel(entry.lastLoginAt)}
                    </TableCell>

                    <TableCell className={styles.colRight}>
                      {roleItems.length > 0 ? (
                        <Menu
                          contentClassName={styles.menuPanel}
                          trigger={
                            <Button
                              variant="ghost"
                              disabled={isBusy}
                              className={`${motion.press} ${styles.roleTrigger}`}
                            >
                              {entry.role}
                              <Icon
                                name="chevron-down"
                                size="sm"
                                className={styles.roleChevron}
                              />
                            </Button>
                          }
                          items={roleItems}
                        />
                      ) : (
                        <Badge
                          variant="info"
                          className={styles.roleBadge}
                          title={entry.roleLocked}
                        >
                          {entry.role}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className={styles.colRight}>
                      {otherItems.length > 0 && (
                        <Menu
                          contentClassName={styles.menuPanel}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className={styles.kebab}
                              disabled={isBusy}
                              aria-label={`Mais ações para ${entry.name}`}
                            >
                              <Icon name="kebab" />
                            </Button>
                          }
                          items={otherItems}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      )}

    </section>
  )
}
