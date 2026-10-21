import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
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
import { Text } from '@nino/ds/components/Text'
import { TEAM_ROSTER_GHOST_ROWS } from '@pages/Employees/constants/employees.constants'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'
import type { RosterEntry } from '@shared/types/team/roster-entry'
import { lastSeenLabel } from '@shared/utils/last-seen/last-seen'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './TeamRoster.module.css'

export type TeamRosterProps = {
  /** Enables moving a member up to a higher cargo. Only the store owner gets this. */
  onChangePosition?: (id: string, positionId: string) => void
  /** Row with a cargo change in progress. */
  changingPositionId?: string
  title: string
  entries: RosterEntry[]
  empty: string
  /** Name or e-mail typed in the page toolbar */
  term?: string
  isPending?: boolean
  removingId?: string
  changingActivityId?: string
  onRemove: (id: string, kind: RosterEntry['kind']) => void
  onEdit?: (id: string) => void
  onSetActivity?: (id: string) => void
  isInactive?: boolean
}

export const TeamRoster = ({
  title,
  entries,
  empty,
  term = '',
  isPending,
  removingId,
  changingActivityId,
  changingPositionId,
  onRemove,
  onEdit,
  onSetActivity,
  isInactive = false,
  onChangePosition,
}: TeamRosterProps) => {
  const query = term.trim().toLowerCase()

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
    if (!onChangePosition || entry.roleLocked) return []

    return (entry.promotionOptions ?? []).map(({ id, label }) => ({
      value: `position-${id}`,
      label: `Promover a ${label}`,
      onSelect: () => onChangePosition(entry.id, id),
    }))
  }

  /* Everything left is a generic action on the person, not on their role —
     these stay behind the kebab. */
  const otherItemsOf = (entry: RosterEntry): MenuItem[] => {
    const items: MenuItem[] = []

    if (entry.emailEditable && onEdit) {
      items.push({
        value: 'edit',
        label: 'Editar',
        onSelect: () => onEdit(entry.id),
      })
    }

    if (entry.removable && entry.kind === 'STAFF' && onSetActivity) {
      if (items.length > 0) items.push({ separator: true })
      items.push({
        value: isInactive ? 'activate' : 'suspend',
        label: isInactive ? 'Reativar' : 'Suspender',
        onSelect: () => onSetActivity(entry.id),
      })
    }

    if (entry.removable) {
      if (items.length > 0) items.push({ separator: true })
      items.push({
        value: 'remove',
        label: 'Remover da loja',
        destructive: true,
        onSelect: () => onRemove(entry.id, entry.kind),
      })
    }

    return items
  }

  return (
    <Box as="section" id="equipe-do-painel" className={styles.roster}>
      <h2 className="sr-only">{title}</h2>

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
                <TableHead className={styles.colRight}>Cargo</TableHead>
                <TableHead>
                  <Text as="span" className="sr-only">
                    Ações
                  </Text>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {TEAM_ROSTER_GHOST_ROWS.map((row) => (
                <TableRow key={row} className={styles.row}>
                  <TableCell className={styles.identityCol}>
                    <Box className={styles.identityCell}>
                      <Skeleton className={styles.ghostMark} />
                      <Box className={styles.person}>
                        <Skeleton className={styles.ghostName} />
                        <Skeleton className={styles.ghostEmail} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell className={styles.seenCol}>
                    <Skeleton className={styles.ghostEmail} />
                  </TableCell>
                  <TableCell className={`${styles.colRight} ${styles.roleCol}`}>
                    <Skeleton className={styles.ghostRole} />
                  </TableCell>
                  <TableCell className={styles.actionsCol} />
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
                <TableHead className={styles.colRight}>Cargo</TableHead>
                <TableHead>
                  <Text as="span" className="sr-only">
                    Ações
                  </Text>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleEntries.map((entry, index) => {
                const roleItems = roleItemsOf(entry)
                const otherItems = otherItemsOf(entry)
                const isBusy =
                  changingPositionId === entry.id ||
                  removingId === entry.id ||
                  changingActivityId === entry.id
                const canEdit = entry.emailEditable && !!onEdit
                const canSetActivity =
                  entry.removable && entry.kind === 'STAFF' && !!onSetActivity
                const identity = (
                  <>
                    <PersonMark
                      name={entry.name}
                      tone={entry.quiet ? 'quiet' : 'brand'}
                    />

                    <Box className={styles.person}>
                      <Text className={styles.name}>{entry.name}</Text>
                      {entry.email && (
                        <Text className={styles.email}>{entry.email}</Text>
                      )}
                    </Box>
                  </>
                )

                return (
                  <TableRow
                    key={entry.id}
                    className={`${motion.deal} ${styles.row}`}
                    style={riseDelay(index * 50 + 60)}
                  >
                    <TableCell className={styles.identityCol}>
                      {entry.href ? (
                        <Link to={entry.href} className={styles.identity}>
                          {identity}
                        </Link>
                      ) : (
                        <Box className={styles.identityCell}>{identity}</Box>
                      )}
                    </TableCell>

                    <TableCell
                      className={`${styles.seenCol} ${
                        entry.lastLoginAt ? styles.lastSeen : styles.neverSeen
                      }`}
                    >
                      {lastSeenLabel(entry.lastLoginAt)}
                    </TableCell>

                    <TableCell className={`${styles.colRight} ${styles.roleCol}`}>
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

                    <TableCell
                      className={`${styles.colRight} ${styles.actionsCol}`}
                    >
                      <Box
                        direction="row"
                        gap={1}
                        className={styles.desktopActions}
                      >
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={motion.press}
                            disabled={isBusy}
                            aria-label={`Editar ${entry.name}`}
                            title="Editar"
                            onClick={() => onEdit(entry.id)}
                          >
                            <Icon name="pencil" />
                          </Button>
                        )}
                        {canSetActivity && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={motion.press}
                            disabled={isBusy}
                            aria-label={`${isInactive ? 'Reativar' : 'Suspender'} ${entry.name}`}
                            title={isInactive ? 'Reativar' : 'Suspender'}
                            onClick={() => onSetActivity(entry.id)}
                          >
                            <Icon name={isInactive ? 'play' : 'pause'} />
                          </Button>
                        )}
                        {entry.removable && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`${motion.press} ${styles.delete}`}
                            disabled={isBusy}
                            aria-label={`Remover ${entry.name} da loja`}
                            title="Remover da loja"
                            onClick={() => onRemove(entry.id, entry.kind)}
                          >
                            <Icon name="trash" />
                          </Button>
                        )}
                      </Box>
                      {otherItems.length > 0 && (
                        <Box className={styles.compactActions}>
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
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  )
}
