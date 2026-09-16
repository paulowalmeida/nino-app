import { useEffect, useRef, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { Icon } from '@nino/ds/components/Icon'
import { Popover } from '@nino/ds/components/Popover'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import type { MenuItem } from '@shared/types/product/menu-item'
import { brl } from '@shared/utils/money/money'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ProductCard.module.css'

const LONG_PRESS_MOVE_TOLERANCE_PX = 10

const useProductCardLongPress = ({
  onLongPress,
  onRelease,
}: {
  onLongPress: () => void
  onRelease?: () => void
}) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const [isPressing, setPressing] = useState(false)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const cancelPress = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    origin.current = null
    setPressing(false)
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return
    origin.current = { x: event.clientX, y: event.clientY }
    setPressing(true)
    timer.current = setTimeout(() => onLongPress(), 450)
  }

  const onPointerMove = (event: React.PointerEvent) => {
    if (!origin.current) return
    const movedX = Math.abs(event.clientX - origin.current.x)
    const movedY = Math.abs(event.clientY - origin.current.y)
    if (
      movedX > LONG_PRESS_MOVE_TOLERANCE_PX ||
      movedY > LONG_PRESS_MOVE_TOLERANCE_PX
    ) {
      cancelPress()
    }
  }

  const onPointerUp = () => {
    cancelPress()
    onRelease?.()
  }

  return {
    isPressing,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  }
}

export type ProductCardProps = {
  item: MenuItem
  index: number
  isPicked?: boolean
  quantity?: number
  onPick: (item: MenuItem) => void
  onStep?: (productId: string, by: number) => void
  onPreviewStart: (item: MenuItem) => void
  onPreviewEnd: () => void
}

export const ProductCard = ({
  item,
  index,
  isPicked = false,
  quantity,
  onPick,
  onStep,
  onPreviewStart,
  onPreviewEnd,
}: ProductCardProps) => {
  const { isPressing, handlers } = useProductCardLongPress({
    onLongPress: () => onPreviewStart(item),
    onRelease: onPreviewEnd,
  })
  const quantityCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isQuantityOpen, setQuantityOpen] = useState(false)
  const imageUrl = item.images?.[0]?.url

  useEffect(
    () => () => {
      if (quantityCloseTimer.current) clearTimeout(quantityCloseTimer.current)
    },
    []
  )

  const openQuantity = () => {
    if (quantityCloseTimer.current) clearTimeout(quantityCloseTimer.current)
    setQuantityOpen(true)
  }

  const closeQuantity = () => {
    quantityCloseTimer.current = setTimeout(() => setQuantityOpen(false), 100)
  }

  const openQuantityWithMouse = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse') openQuantity()
  }

  const closeQuantityWithMouse = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse') closeQuantity()
  }

  return (
    <>
      <Card
        asChild
        variant="flat"
        padding="none"
        role="button"
        tabIndex={0}
        aria-pressed={isPicked}
        onClick={() => onPick(item)}
        onKeyDown={(event) => {
          if (
            event.target === event.currentTarget &&
            (event.key === 'Enter' || event.key === ' ')
          ) {
            event.preventDefault()
            onPick(item)
          }
        }}
        style={riseDelay(index * 25)}
        className={mergeClasses(
          motion.settle,
          motion.press,
          styles.card,
          isPicked && styles.picked,
          isPressing && styles.pressing
        )}
        onPointerEnter={openQuantityWithMouse}
        onPointerLeave={closeQuantityWithMouse}
        {...handlers}
        onPointerMove={(event) => {
          handlers.onPointerMove(event)
          openQuantityWithMouse(event)
        }}
      >
        <div>
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
          {isPicked && quantity !== undefined && onStep && (
            <Box
              className={styles.quantity}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
            >
              <Popover
                placement="bottom-end"
                open={isQuantityOpen}
                onOpenChange={setQuantityOpen}
                onContentPointerEnter={openQuantity}
                onContentPointerLeave={closeQuantity}
                contentClassName={styles.quantityPanel}
                trigger={
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={styles.quantityBadge}
                    aria-label={`Alterar quantidade de ${item.name}: ${quantity}`}
                  >
                    <span className={styles.quantityValue}>{quantity}</span>
                  </Button>
                }
              >
                <Box
                  direction="row"
                  align="center"
                  className={styles.quantityStepper}
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={styles.removeQuantity}
                    aria-label={`Remover todos os ${item.name} da comanda`}
                    onClick={() => onStep(item.id, -quantity)}
                  >
                    <Icon name="trash" size="xs" />
                  </Button>
                  {quantity > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className={styles.stepQuantity}
                      aria-label={`Diminuir quantidade de ${item.name}`}
                      onClick={() => onStep(item.id, -1)}
                    >
                      <Icon name="minus" size="xs" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={styles.stepQuantity}
                    aria-label={`Mais um ${item.name}`}
                    onClick={() => onStep(item.id, 1)}
                  >
                    <Icon name="plus" size="xs" />
                  </Button>
                </Box>
              </Popover>
            </Box>
          )}
        </div>
      </Card>
    </>
  )
}
