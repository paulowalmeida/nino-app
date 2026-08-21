import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { ItemThumb } from '@atoms/ItemThumb/ItemThumb'
import { useLongPress } from '@hooks/ui/useLongPress'
import type { MenuItem } from '@custom_types/product/menu-item'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './ProductCard.module.css'
import motion from '@styles/motion.module.css'

export type ProductCardProps = {
  item: MenuItem
  index: number
  onPick: (item: MenuItem) => void
  onPreviewStart: (item: MenuItem) => void
  onPreviewEnd: () => void
}

export const ProductCard = ({
  item,
  index,
  onPick,
  onPreviewStart,
  onPreviewEnd,
}: ProductCardProps) => {
  const { isPressing, handlers } = useLongPress({
    onLongPress: () => onPreviewStart(item),
    onRelease: onPreviewEnd,
  })
  const imageUrl = item.images?.[0]?.url

  return (
    <>
      <Card
        variant="flat"
        padding="none"
        onClick={() => onPick(item)}
        style={riseDelay(index * 25)}
        className={mergeClasses(
          motion.settle,
          motion.press,
          styles.card,
          isPressing && styles.pressing
        )}
        {...handlers}
      >
        <ItemThumb
          name={item.name}
          imageUrl={imageUrl}
          className={styles.photo}
          wrapperClassName={styles.photoWrap}
        />

        <Box className={styles.footer}>
          <Text as="span" size="sm" weight="semibold" className={styles.name}>
            {item.name}
          </Text>
          <Text
            as="span"
            size="lg"
            weight="extrabold"
            font="display"
            className={styles.price}
          >
            {brl(item.price)}
          </Text>
        </Box>
      </Card>
    </>
  )
}
