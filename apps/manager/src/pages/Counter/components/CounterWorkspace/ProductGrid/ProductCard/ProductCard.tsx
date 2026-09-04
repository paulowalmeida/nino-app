import { useEffect, useRef, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import type { MenuItem } from '@shared/types/product/menu-item'
import { brl } from '@shared/utils/money/money'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ProductCard.module.css'

const useProductCardLongPress = ({
  onLongPress,
  onRelease,
}: {
  onLongPress: () => void
  onRelease?: () => void
}) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPressing, setPressing] = useState(false)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return
    setPressing(true)
    timer.current = setTimeout(() => onLongPress(), 450)
  }

  const onPointerUp = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    setPressing(false)
    onRelease?.()
  }

  return { isPressing, handlers: { onPointerDown, onPointerUp } }
}

export type ProductCardProps = {
  item: MenuItem
  index: number
  isPicked?: boolean
  onPick: (item: MenuItem) => void
  onPreviewStart: (item: MenuItem) => void
  onPreviewEnd: () => void
}

export const ProductCard = ({
  item,
  index,
  isPicked = false,
  onPick,
  onPreviewStart,
  onPreviewEnd,
}: ProductCardProps) => {
  const { isPressing, handlers } = useProductCardLongPress({
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
          isPicked && styles.picked,
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
          <Text as="span" size="xs" weight="semibold" className={styles.name}>
            {item.name}
          </Text>
          <Text
            as="span"
            size="sm"
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
