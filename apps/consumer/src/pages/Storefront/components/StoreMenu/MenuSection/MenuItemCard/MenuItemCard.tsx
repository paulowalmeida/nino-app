import type { MouseEvent } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Heading } from '@nino/ds/components/Heading'
import { Image } from '@nino/ds/components/Image'
import { Icon } from '@nino/ds/components/Icon'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { brl } from '@utils/money'
import { minimumProductPrice } from '@pages/Storefront/utils/minimum-product-price/minimum-product-price'
import { primaryImage } from '@utils/menu-image'
import { useStoreCatalog } from '@hooks/useStoreCatalog/useStoreCatalog'
import type { MenuItem } from '@custom_types/menu/menu-item'

import styles from './MenuItemCard.module.css'

type MenuItemCardProps = {
  item: MenuItem
  onAdd: (item: MenuItem) => void
  onSelect: (item: MenuItem) => void
  /** Loja fechada: mostra o item apagado e não deixa pedir. */
  disabled?: boolean
  /** Quantas unidades já estão na sacola — 0 não marca nada. */
  quantity?: number
}

/**
 * O item do cardápio: sempre uma linha com a foto à esquerda, em todo
 * breakpoint. O botão de abrir cobre foto e texto, e o somar fica sempre no
 * mesmo canto.
 */
export const MenuItemCard = ({
  item,
  onAdd,
  onSelect,
  disabled = false,
  quantity = 0,
}: MenuItemCardProps) => {
  const { itemStyle, imageRatio, density, showDescription } = useStoreCatalog()
  const image = primaryImage(item)

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
      data-item-style={itemStyle}
      data-density={density}
      data-image-ratio={imageRatio}
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
            wrapperClassName={styles.photoWrap}
            placeholder={
              image ? (
                <Box className={styles.photoPlaceholder} aria-hidden="true" />
              ) : undefined
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
          {showDescription && item.description && (
            <Text as="p" className={styles.description}>
              {item.description}
            </Text>
          )}
          <Text as="span" className={styles.price}>
            {item.pricingType === 'COMPOSED' ? 'A partir de ' : ''}
            {brl(minimumProductPrice(item))}
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
