import type { MouseEvent } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Heading } from '@nino/ds/components/Heading'
import { Image } from '@nino/ds/components/Image'
import { Icon } from '@nino/ds/components/Icon'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { primaryImage } from '@utils/menu-image'
import type { MenuItem } from '@custom_types/menu/menu-item'

import styles from './MenuItemCard.module.css'

type MenuItemCardProps = {
  item: MenuItem
  onAdd: (item: MenuItem) => void
  onSelect: (item: MenuItem) => void
  /** Loja fechada: mostra o item apagado e não deixa pedir. */
  disabled?: boolean
  /** Emoji da categoria para o quadro quando o item não tem foto. */
  fallbackIcon?: string | null
  /** Quantas unidades já estão na sacola — 0 não marca nada. */
  quantity?: number
}

/**
 * O item do cardápio. Abaixo de 640 é uma linha larga com a foto à direita;
 * na grade a foto sobe para o topo e o card vira vertical. O botão de abrir
 * cobre foto e texto, e o somar fica sempre no mesmo canto.
 */
export const MenuItemCard = ({
  item,
  onAdd,
  onSelect,
  disabled = false,
  fallbackIcon,
  quantity = 0,
}: MenuItemCardProps) => {
  const image = primaryImage(item)
  const glyph = categoryIcon(item.name) ?? fallbackIcon ?? '🍽️'

  const handleAdd = (event: MouseEvent) => {
    event.stopPropagation()
    if (disabled) return
    onAdd(item)
  }

  return (
    <Card
      padding="sm"
      className={disabled ? `${styles.card} ${styles.disabled}` : styles.card}
      role="group"
      aria-disabled={disabled}
    >
      <Button
        variant="ghost"
        className={styles.open}
        disabled={disabled}
        aria-label={`Ver detalhes de ${item.name}`}
        onClick={() => onSelect(item)}
      >
        <Box className={styles.media}>
          <Image
            src={image}
            alt=""
            className={styles.photo}
            wrapperClassName={styles.photo}
            placeholder={
              <Box className={styles.noPhoto} aria-hidden="true">
                {glyph}
              </Box>
            }
          />
          {quantity > 0 && (
            <Text
              as="span"
              className={styles.tally}
              aria-label={`${quantity} na sacola`}
            >
              {quantity}
            </Text>
          )}
        </Box>

        <Box className={styles.body}>
          <Heading level={3} className={styles.name}>
            {item.name}
          </Heading>
          {item.description && (
            <Text as="p" className={styles.description}>
              {item.description}
            </Text>
          )}
          <Text as="span" className={styles.price}>
            {brl(item.price)}
          </Text>
        </Box>
      </Button>

      <Button
        variant="primary"
        size="icon"
        className={styles.add}
        aria-label={`Adicionar ${item.name}`}
        disabled={disabled}
        onClick={handleAdd}
      >
        <Icon name="plus" />
      </Button>
    </Card>
  )
}
