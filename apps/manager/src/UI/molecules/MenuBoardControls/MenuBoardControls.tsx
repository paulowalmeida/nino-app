import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import styles from './MenuBoardControls.module.css'
import motion from '@styles/motion.module.css'

export type MenuBoardControlsSelection = {
  isSelecting: boolean
  selectedItemCount: number
  isAllLoadedSelected: boolean
  isSomeLoadedSelected: boolean
  onStartSelection: () => void
  onToggleAllSelection: () => void
  onCancelSelection: () => void
  onRequestBulkDelete: () => void
}

type MenuBoardControlsProps = {
  total: number
  canReorder: boolean
  selection: MenuBoardControlsSelection
}

export const MenuBoardControls = ({
  total,
  canReorder,
  selection,
}: MenuBoardControlsProps) => {
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
    <Box
      direction="row"
      align="center"
      gap={2}
      shrink={false}
      className={styles.toolbar}
    >
      <Box
        align="center"
        justify="center"
        shrink={false}
        className={styles.toolbarLead}
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

      <Text as="p" size="xs" color="faint" className={styles.tally}>
        {isSelecting
          ? selectedItemCount === 1
            ? '1 selecionado'
            : `${selectedItemCount} selecionados`
          : total === 1
            ? '1 item'
            : `${total} itens`}
        {canReorder &&
          !isSelecting &&
          ' · arraste para mudar a ordem no app do cliente'}
      </Text>

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
    </Box>
  )
}
