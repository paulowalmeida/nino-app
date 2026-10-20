import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { ListRow } from '@nino/ds/components/ListRow'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import { Text } from '@nino/ds/components/Text'
import { usePositionsFacade } from '@pages/Positions/facades/usePositionsFacade/usePositionsFacade'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

import motion from '@styles/motion.module.css'
import styles from './PositionRow.module.css'

type PositionRowProps = {
  position: UnitPosition
  onEdit: (position: UnitPosition) => void
  onRemove: (position: UnitPosition) => void
}

const peopleLabel = (count: number): string =>
  count === 1 ? '1 pessoa' : `${count} pessoas`

const permissionsLabel = (count: number): string =>
  count === 1 ? '1 permissão' : `${count} permissões`

export const PositionRow = ({
  position,
  onEdit,
  onRemove,
}: PositionRowProps) => {
  const { duplicatePosition, duplicatingId } = usePositionsFacade()
  const isBusy = duplicatingId === position.id

  const summary = position.isProtected
    ? `Acesso total · ${peopleLabel(position.memberCount)}`
    : `Nível ${position.level} · ${permissionsLabel(position.permissions.length)} · ${peopleLabel(position.memberCount)}`

  const items: MenuItem[] = []
  if (!position.isDefault) {
    items.push({
      value: 'edit',
      label: 'Editar',
      onSelect: () => onEdit(position),
    })
  }
  if (!position.isProtected) {
    items.push({
      value: 'duplicate',
      label: 'Duplicar',
      onSelect: () => duplicatePosition(position.id),
    })
  }
  if (!position.isDefault) {
    items.push({ separator: true })
    items.push({
      value: 'remove',
      label: 'Remover',
      destructive: true,
      onSelect: () => onRemove(position),
    })
  }

  return (
    <ListRow className={motion.deal}>
      <Box className={styles.identity}>
        <Text className={styles.name}>{position.name}</Text>
        <Text className={styles.summary}>{summary}</Text>
      </Box>

      {position.isDefault && <Badge variant="info">Padrão</Badge>}

      {items.length > 0 && (
        <Menu
          trigger={
            <Button
              variant="ghost"
              size="icon"
              disabled={isBusy}
              aria-label={`Mais ações para ${position.name}`}
            >
              <Icon name="kebab" />
            </Button>
          }
          items={items}
        />
      )}
    </ListRow>
  )
}
