import { useState } from 'react'

import type { MenuItem } from '@custom_types/menu/menu-item'
import { AnimatedNumber } from '@elements/AnimatedNumber/AnimatedNumber'
import { useIsDesktop } from '@hooks/useIsDesktop'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Carousel } from '@nino/ds/components/Carousel'
import { Drawer } from '@nino/ds/components/Drawer'
import { Image } from '@nino/ds/components/Image'
import { QuantityStepper } from '@nino/ds/components/QuantityStepper'
import { Text } from '@nino/ds/components/Text'
import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'
import { useHomeSlug } from '@pages/Home/hooks/useHomeSlug/useHomeSlug'
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ProductDetail.module.css'
import { ProductDetailModal } from './ProductDetailModal/ProductDetailModal'

export const ProductDetail = () => {
  const slug = useHomeSlug()
  const { selectedItem: item, setSelectedItem, addToCart } = useHomeFacade(slug)
  const onClose = () => setSelectedItem(null)
  const onConfirm = (selected: MenuItem, quantity: number) => {
    addToCart(selected, quantity)
    setSelectedItem(null)
  }
  const [quantity, setQuantity] = useState(1)
  const isDesktop = useIsDesktop()

  const [shown, setShown] = useState(item)
  if (item && item !== shown) {
    setShown(item)
    setQuantity(1)
  }

  const isOpen = item !== null

  const images = shown && shown.images.length > 0 ? shown.images : null

  const fallback = (
    <Box className={styles.photoFallback} aria-hidden="true">
      <Text as="span" className={styles.fallbackGlyph}>
        {(shown ? categoryIcon(shown.name) : null) ?? '🍽️'}
      </Text>
    </Box>
  )

  const media = images ? (
    <Carousel
      slides={images.map((image) => (
        <Image
          key={image.id}
          src={image.url}
          alt=""
          className={styles.photo}
          wrapperClassName={styles.photoWrap}
          placeholder={fallback}
        />
      ))}
    />
  ) : (
    fallback
  )

  const reveal = shown ? (
    <Box key={shown.id}>
      <Box className={`${motion.riseIn} ${styles.media}`}>{media}</Box>
      {shown.description && (
        <Text
          className={`${motion.riseIn} ${styles.description}`}
          style={riseDelay(70)}
        >
          {shown.description}
        </Text>
      )}
    </Box>
  ) : null

  const stepper = (
    <QuantityStepper
      quantity={quantity}
      count={<AnimatedNumber value={quantity} />}
      incrementLabel="Aumentar quantidade"
      decrementLabel="Diminuir quantidade"
      isDecrementDisabled={quantity <= 1}
      onIncrement={() => setQuantity((current) => current + 1)}
      onDecrement={() => setQuantity((current) => Math.max(1, current - 1))}
    />
  )

  const confirmButton = shown ? (
    <Button
      className={styles.confirm}
      onClick={() => onConfirm(shown, quantity)}
    >
      Adicionar <AnimatedNumber value={brl(Number(shown.price) * quantity)} />
    </Button>
  ) : null

  if (isDesktop) {
    return (
      <ProductDetailModal
        item={shown}
        isOpen={isOpen}
        media={media}
        stepper={stepper}
        confirmButton={confirmButton}
        onClose={onClose}
      />
    )
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      placement="bottom"
      title={shown?.name ?? ''}
      size="auto"
      contentClassName={styles.drawer}
    >
      {reveal}

      <Box className={styles.footer}>
        {stepper}
        {confirmButton}
      </Box>
    </Drawer>
  )
}
