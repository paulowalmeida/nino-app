import type { DragControls } from 'framer-motion'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Icon } from '@nino/ds/components/Icon'

import styles from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowLeadingControl/MenuRowLeadingControl.module.css'

type MenuRowLeadingControlProps = {
  itemName: string
  canReorder: boolean
  isSelecting: boolean
  isSelected: boolean
  dragControls: DragControls
  onToggleSelect: () => void
}

export const MenuRowLeadingControl = ({
  itemName,
  canReorder,
  isSelecting,
  isSelected,
  dragControls,
  onToggleSelect,
}: MenuRowLeadingControlProps) => {
  if (isSelecting) {
    return (
      <Box className={styles.selectCheckbox} align="center" justify="center">
        <Checkbox
          size="sm"
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label={`Selecionar ${itemName}`}
        />
      </Box>
    )
  }

  if (!canReorder) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      className={styles.dragHandle}
      aria-label={`Reordenar ${itemName}`}
      onPointerDown={(event) => dragControls.start(event)}
    >
      <Icon name="grip" />
    </Button>
  )
}
