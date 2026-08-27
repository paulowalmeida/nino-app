import { type AnimationEvent,useState } from 'react'

import { Reorder, useDragControls } from 'framer-motion'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { REORDER_TRANSITION } from '@shared/constants/reorder-transition.constants'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './CategoryRow.module.css'

const countLabel = (count: number): string =>
  count === 1 ? '1 item' : `${count} itens`

type CategoryRowProps = {
  category: CategoryWithCount
  index: number
  isRenaming: boolean
  onRename: (name: string) => Promise<void>
  onDelete: () => void
  onDragEnd: () => void
  disabled: boolean
}

export const CategoryRow = ({
  category,
  index,
  isRenaming,
  onRename,
  onDelete,
  onDragEnd,
  disabled,
}: CategoryRowProps) => {
  const dragControls = useDragControls()
  const [editing, setEditing] = useState(false)
  const [isEntering, setIsEntering] = useState(true)
  const [draft, setDraft] = useState(category.name)
  const empty = category.count === 0

  const handleEntranceEnd = (event: AnimationEvent<HTMLLIElement>) => {
    if (event.target === event.currentTarget) setIsEntering(false)
  }

  const closeEditing = () => {
    setEditing(false)
    setDraft(category.name)
  }

  const submit = async () => {
    const name = draft.trim()
    if (!name || name === category.name) return closeEditing()
    try {
      await onRename(name)
      setEditing(false)
    } catch {
      return
    }
  }

  return (
    <Reorder.Item
      as="li"
      value={category}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      onAnimationEnd={handleEntranceEnd}
      transition={REORDER_TRANSITION}
      className={`${isEntering ? motion.deal : ''} ${styles.row}`}
      style={isEntering ? riseDelay(index * 35 + 60) : {}}
    >
      {editing ? (
        <Box
          as="form"
          className={styles.editForm}
          onSubmit={(event) => {
            event.preventDefault()
            void submit()
          }}
        >
          <Input
            autoFocus
            value={draft}
            aria-label={`Novo nome para ${category.name}`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === 'Escape' && closeEditing()}
          />
          <Button size="sm" type="submit" loading={isRenaming}>
            Salvar
          </Button>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            disabled={isRenaming}
            onClick={closeEditing}
          >
            Cancelar
          </Button>
        </Box>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={styles.dragHandle}
            aria-label={`Reordenar ${category.name}`}
            onPointerDown={(event) => dragControls.start(event)}
          >
            <Icon name="grip" />
          </Button>

          <Box className={styles.who}>
            <Text as="span" className={styles.name}>{category.name}</Text>
            <Text as="span" className={empty ? styles.hintEmpty : styles.hint}>
              {empty ? 'Vazia — nenhum item ainda' : countLabel(category.count)}
            </Text>
          </Box>

          <Box direction="row" gap={1} align="center" shrink={false}>
            <Button
              variant="ghost"
              size="icon"
              className={`${motion.press} ${styles.action}`}
              aria-label={`Renomear ${category.name}`}
              disabled={disabled}
              onClick={() => setEditing(true)}
            >
              <Icon name="pencil" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${motion.press} ${styles.action} ${styles.danger}`}
              aria-label={`Excluir ${category.name}`}
              disabled={disabled}
              onClick={onDelete}
            >
              <Icon name="trash" />
            </Button>
          </Box>
        </>
      )}
    </Reorder.Item>
  )
}
