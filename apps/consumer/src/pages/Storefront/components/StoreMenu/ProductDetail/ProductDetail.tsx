import { useState } from 'react'

import type { MenuItem } from '@custom_types/menu/menu-item'
import { AnimatedNumber } from '@shared/components/AnimatedNumber/AnimatedNumber'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Carousel } from '@nino/ds/components/Carousel'
import { Dialog } from '@nino/ds/components/Dialog'
import { Image } from '@nino/ds/components/Image'
import { QuantityStepper } from '@nino/ds/components/QuantityStepper'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'

import styles from './ProductDetail.module.css'
import { ProductDetailModal } from './ProductDetailModal/ProductDetailModal'

export const ProductDetail = () => {
  const {
    selectedItem: item,
    setSelectedItem,
    addToCart,
    replaceCart,
  } = useStorefrontFacade()
  const onClose = () => {
    setQuantity(1)
    setSelectedItem(null)
  }
  const [pendingReplacement, setPendingReplacement] = useState<{
    item: MenuItem
    quantity: number
  } | null>(null)
  const onConfirm = (selected: MenuItem, quantity: number) => {
    if (addToCart(selected, quantity)) {
      setQuantity(1)
      setSelectedItem(null)
      return
    }

    setQuantity(1)
    setSelectedItem(null)
    setPendingReplacement({ item: selected, quantity })
  }
  const [quantity, setQuantity] = useState(1)
  const isOpen = item !== null

  const images = item && item.images.length > 0 ? item.images : null

  const fallback = (
    <Box className={styles.photoFallback} aria-hidden="true">
      <Text as="span" className={styles.fallbackGlyph}>
        {(item ? categoryIcon(item.name) : null) ?? '🍽️'}
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

  const confirmButton = item ? (
    <Button
      className={styles.confirm}
      onClick={() => onConfirm(item, quantity)}
    >
      Adicionar <AnimatedNumber value={brl(Number(item.price) * quantity)} />
    </Button>
  ) : null

  const detail = (
    <ProductDetailModal
      item={item}
      isOpen={isOpen}
      media={media}
      stepper={stepper}
      confirmButton={confirmButton}
      onClose={onClose}
    />
  )

  return (
    <>
      {detail}
      <Dialog
        open={pendingReplacement !== null}
        onOpenChange={(open) => !open && setPendingReplacement(null)}
        title="Começar uma sacola nova?"
        description="Sua sacola atual é de outra loja. Para adicionar este item, ela precisa ser substituída."
        confirmLabel="Trocar de loja"
        cancelLabel="Manter sacola"
        onConfirm={() => {
          if (!pendingReplacement) return
          replaceCart(pendingReplacement.item, pendingReplacement.quantity)
          setPendingReplacement(null)
          setSelectedItem(null)
        }}
        onCancel={() => setPendingReplacement(null)}
      />
    </>
  )
}
