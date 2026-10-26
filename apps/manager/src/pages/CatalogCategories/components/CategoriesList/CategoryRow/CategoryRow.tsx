import { type AnimationEvent, useState } from 'react'

import { Reorder, useDragControls } from 'framer-motion'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import { TableCell } from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
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
  onEdit: () => void
  onDelete: () => void
  disabled: boolean
}

export const CategoryRow = ({
  category,
  index,
  onEdit,
  onDelete,
  disabled,
}: CategoryRowProps) => {
  const dragControls = useDragControls()
  const [isEntering, setIsEntering] = useState(true)
  const empty = category.count === 0

  const handleEntranceEnd = (event: AnimationEvent<HTMLTableRowElement>) => {
    if (event.target === event.currentTarget) setIsEntering(false)
  }

  const actionItems: MenuItem[] = [
    { value: 'edit', label: 'Editar', onSelect: onEdit },
    { separator: true },
    {
      value: 'delete',
      label: 'Excluir',
      destructive: true,
      onSelect: onDelete,
    },
  ]

  return (
    <Reorder.Item
      as="tr"
      value={category}
      dragListener={false}
      dragControls={dragControls}
      onAnimationEnd={handleEntranceEnd}
      transition={REORDER_TRANSITION}
      className={mergeClasses(styles.categoryRow, isEntering && motion.deal)}
      style={isEntering ? riseDelay(index * 35 + 60) : {}}
    >
      <TableCell className={styles.dragCell}>
        <Button
          variant="ghost"
          size="icon"
          className={styles.dragHandle}
          aria-label={`Reordenar ${category.name}`}
          onPointerDown={(event) => dragControls.start(event)}
        >
          <Icon name="grip" />
        </Button>
      </TableCell>

      <TableCell className={styles.who}>
        <Text as="span" className={styles.name}>
          {category.name}
        </Text>
        <Text as="span" className={empty ? styles.hintEmpty : styles.hint}>
          {empty ? 'Vazia — nenhum item ainda' : countLabel(category.count)}
        </Text>
      </TableCell>

      <TableCell className={styles.actionsCell}>
        <Box direction="row" gap={1} className={styles.desktopActions}>
          <Button
            variant="ghost"
            size="icon"
            className={motion.press}
            disabled={disabled}
            aria-label={`Renomear ${category.name}`}
            onClick={onEdit}
          >
            <Icon name="pencil" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`${motion.press} ${styles.delete}`}
            disabled={disabled}
            aria-label={`Excluir ${category.name}`}
            onClick={onDelete}
          >
            <Icon name="trash" />
          </Button>
        </Box>
        <Box className={styles.compactActions}>
          <Menu
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className={motion.press}
                disabled={disabled}
                aria-label={`Mais ações para ${category.name}`}
              >
                <Icon name="kebab" />
              </Button>
            }
            items={actionItems}
          />
        </Box>
      </TableCell>
    </Reorder.Item>
  )
}
