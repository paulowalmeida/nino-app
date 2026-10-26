import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Switch } from '@nino/ds/components/Switch'
import type { MenuItem } from '@shared/types/product/menu-item'

import motion from '@styles/motion.module.css'
import styles from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowTrailingActions/MenuRowTrailingActions.module.css'

type MenuRowTrailingActionsProps = {
  item: MenuItem
  isSelecting: boolean
  onToggleAvailability: (isActive: boolean) => void
  onDelete: () => void
  canManageCatalog?: boolean
}

export const MenuRowTrailingActions = ({
  item,
  isSelecting,
  onToggleAvailability,
  onDelete,
  canManageCatalog = true,
}: MenuRowTrailingActionsProps) =>
  canManageCatalog ? (
    <>
      <Switch
        size="sm"
        checked={item.isActive}
        disabled={isSelecting}
        onCheckedChange={onToggleAvailability}
        aria-label={`${item.name} disponível`}
      />

      {!isSelecting && (
        <Button
          variant="ghost"
          size="icon"
          className={`${motion.press} ${styles.delete}`}
          aria-label={`Excluir ${item.name}`}
          onClick={onDelete}
        >
          <Icon name="trash" />
        </Button>
      )}
    </>
  ) : null
