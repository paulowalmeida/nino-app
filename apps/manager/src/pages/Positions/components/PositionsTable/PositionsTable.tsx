import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'
import type { UnitPosition } from '@shared/types/team/unit-position.type'
import { placementOptions } from '@shared/utils/position-form/position-form'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './PositionsTable.module.css'

type PositionsTableProps = {
  positions: UnitPosition[]
  onRemove: (position: UnitPosition) => void
}

const peopleLabel = (count: number): string =>
  count === 1 ? '1 pessoa' : `${count} pessoas`

export const PositionsTable = ({
  positions,
  onRemove,
}: PositionsTableProps) => {
  const { duplicatePosition, duplicatingId, movePosition, permissionTotal } =
    usePositionsFacade()

  const accessOf = ({ isProtected, permissions }: UnitPosition): string =>
    isProtected
      ? 'Acesso total'
      : `${permissions.length} de ${permissionTotal}`

  const aboveNameOf = ({ belowPositionId }: UnitPosition): string =>
    positions.find(({ id }) => id === belowPositionId)?.name ?? '—'

  const belowItemsOf = (position: UnitPosition): MenuItem[] =>
    placementOptions(positions, position.id).map(({ value, label }) => ({
      value,
      label: value === position.belowPositionId ? `${label} — atual` : label,
      disabled: value === position.belowPositionId,
      onSelect: () =>
        movePosition({
          positionId: position.id,
          draft: { belowPositionId: value },
        }),
    }))

  const itemsOf = (position: UnitPosition): MenuItem[] => {
    const items: MenuItem[] = []
    if (!position.isProtected) {
      items.push(
        {
          value: 'duplicate',
          label: 'Duplicar',
          onSelect: () => duplicatePosition(position.id),
        },
        { separator: true },
        {
          value: 'remove',
          label: 'Remover',
          destructive: true,
          onSelect: () => onRemove(position),
        }
      )
    }
    return items
  }

  return (
    <Box className={styles.shell}>
      <Table>
        <colgroup>
          <col className={styles.colName} />
          <col className={styles.colBelow} />
          <col className={styles.colAccess} />
          <col className={styles.colPeople} />
          <col className={styles.colActions} />
        </colgroup>
        <TableHeader>
          <TableRow className={styles.headRow}>
            <TableHead>Cargo</TableHead>
            <TableHead className={styles.showOnWide}>Subordinado a</TableHead>
            <TableHead>Permissões</TableHead>
            <TableHead className={styles.hideOnSmall}>Pessoas</TableHead>
            <TableHead>
              <Text as="span" className="sr-only">
                Ações
              </Text>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {positions.map((position, index) => {
            const items = itemsOf(position)

            return (
              <TableRow
                key={position.id}
                className={motion.deal}
                style={riseDelay(index * 50 + 60)}
              >
                <TableCell>
                  <Link to={position.id} className={styles.identity}>
                    <Text className={styles.name}>{position.name}</Text>
                  </Link>
                  <Text className={styles.smallOnly}>
                    {peopleLabel(position.memberCount)}
                  </Text>
                </TableCell>
                <TableCell className={styles.showOnWide}>
                  {position.isProtected ? (
                    <Text className={styles.access}>Topo da hierarquia</Text>
                  ) : (
                    <Menu
                      contentClassName={styles.menuPanel}
                      trigger={
                        <Button
                          variant="ghost"
                          className={`${motion.press} ${styles.belowTrigger}`}
                        >
                          {aboveNameOf(position)}
                          <Icon
                            name="chevron-down"
                            size="sm"
                            className={styles.belowChevron}
                          />
                        </Button>
                      }
                      items={belowItemsOf(position)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Text className={styles.access}>{accessOf(position)}</Text>
                </TableCell>
                <TableCell className={styles.hideOnSmall}>
                  <Text className={styles.number}>{position.memberCount}</Text>
                </TableCell>
                <TableCell className={styles.actions}>
                  <Box direction="row" className={styles.wideActions}>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      aria-label={`Ver detalhes de ${position.name}`}
                    >
                      <Link to={position.id} title="Ver detalhes">
                        <Icon name="eye" />
                      </Link>
                    </Button>
                    {!position.isProtected && (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={duplicatingId === position.id}
                        aria-label={`Duplicar ${position.name}`}
                        title="Duplicar"
                        onClick={() => duplicatePosition(position.id)}
                      >
                        <Icon name="copy" />
                      </Button>
                    )}
                    {!position.isProtected && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={styles.removeButton}
                        aria-label={`Remover ${position.name}`}
                        title="Remover"
                        onClick={() => onRemove(position)}
                      >
                        <Icon name="trash" />
                      </Button>
                    )}
                  </Box>
                  {items.length > 0 && (
                    <Box className={styles.compactActions}>
                      <Menu
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={duplicatingId === position.id}
                            aria-label={`Mais ações para ${position.name}`}
                          >
                            <Icon name="kebab" />
                          </Button>
                        }
                        items={items}
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
  )
}
