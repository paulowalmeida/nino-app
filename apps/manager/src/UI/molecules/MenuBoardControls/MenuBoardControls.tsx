import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Icon } from '@nino/ds/components/Icon'

import styles from './MenuBoardControls.module.css'
import motion from '@styles/motion.module.css'

export type MenuBoardSelection = {
  isSelecting: boolean
  selectedIds: Set<string>
  onStartSelection: () => void
  onToggleSelection: (id: string) => void
  onToggleAllSelection: () => void
  onCancelSelection: () => void
  onRequestBulkDelete: () => void
}

type MenuBoardControlsProps = {
  loadedItemCount: number
  total: number
  canReorder: boolean
  selection: MenuBoardSelection
}

export const MenuBoardControls = ({
  loadedItemCount,
  total,
  canReorder,
  selection,
}: MenuBoardControlsProps) => {
  const {
    isSelecting,
    selectedIds,
    onStartSelection,
    onToggleAllSelection,
    onCancelSelection,
    onRequestBulkDelete,
  } = selection
  const allLoadedSelected =
    loadedItemCount > 0 && selectedIds.size === loadedItemCount
  const someLoadedSelected = selectedIds.size > 0 && !allLoadedSelected

  return (
    <Flexbox
      direction="row"
      align="center"
      gap={2}
      shrink={false}
      className={styles.toolbar}
    >
      <Flexbox className={styles.toolbarLead}>
        {isSelecting ? (
          <Checkbox
            size="sm"
            checked={
              allLoadedSelected
                ? true
                : someLoadedSelected
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={onToggleAllSelection}
            className={motion.press}
            aria-label={
              allLoadedSelected ? 'Desmarcar todos' : 'Selecionar todos'
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
      </Flexbox>

      <p className={styles.tally}>
        {isSelecting
          ? selectedIds.size === 1
            ? '1 selecionado'
            : `${selectedIds.size} selecionados`
          : total === 1
            ? '1 item'
            : `${total} itens`}
        {canReorder &&
          !isSelecting &&
          ' · arraste para mudar a ordem no app do cliente'}
      </p>

      {isSelecting && (
        <Flexbox
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

          {selectedIds.size > 0 && (
            <Button
              variant="danger"
              size="sm"
              className={`${motion.pop} ${motion.press}`}
              onClick={onRequestBulkDelete}
            >
              Excluir
            </Button>
          )}
        </Flexbox>
      )}
    </Flexbox>
  )
}
