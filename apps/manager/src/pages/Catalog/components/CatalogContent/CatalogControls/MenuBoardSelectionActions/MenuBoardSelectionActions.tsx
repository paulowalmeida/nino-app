import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Icon } from '@nino/ds/components/Icon'
import type { CatalogControlsSelection } from '@pages/Catalog/types/CatalogControlsSelection.type'

import motion from '@styles/motion.module.css'
import styles from '@pages/Catalog/components/CatalogContent/CatalogControls/MenuBoardSelectionActions/MenuBoardSelectionActions.module.css'

type MenuBoardSelectionActionsProps = {
  selection: CatalogControlsSelection
}

export const MenuBoardSelectionActions = ({
  selection,
}: MenuBoardSelectionActionsProps) => {
  const {
    isSelecting,
    selectedItemCount,
    isAllLoadedSelected,
    isSomeLoadedSelected,
    onStartSelection,
    onToggleAllSelection,
    onCancelSelection,
    onRequestBulkDelete,
  } = selection

  return (
    <>
      <Box
        align="center"
        justify="center"
        shrink={false}
        className={styles.lead}
      >
        {isSelecting ? (
          <Checkbox
            size="sm"
            checked={
              isAllLoadedSelected
                ? true
                : isSomeLoadedSelected
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={onToggleAllSelection}
            className={motion.press}
            aria-label={
              isAllLoadedSelected ? 'Desmarcar todos' : 'Selecionar todos'
            }
          />
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={motion.press}
            aria-label="Selecionar itens"
            onClick={onStartSelection}
          >
            <Icon name="check-square" />
          </Button>
        )}
      </Box>

      {isSelecting && (
        <Box
          direction="row"
          align="center"
          gap={2}
          shrink={false}
          className={motion.unroll}
        >
          <Button
            variant="ghost"
            size="sm"
            className={motion.press}
            onClick={onCancelSelection}
          >
            Cancelar
          </Button>

          {selectedItemCount > 0 && (
            <Button
              variant="danger"
              size="sm"
              className={`${motion.pop} ${motion.press}`}
              onClick={onRequestBulkDelete}
            >
              Excluir
            </Button>
          )}
        </Box>
      )}
    </>
  )
}
