import { Flexbox } from '@nino/ds/components/Flexbox'
import { useState } from 'react'

import { Card } from '@nino/ds/components/Card'
import { Modal } from '@nino/ds/components/Modal'
import { ItemThumb } from '@components/ItemThumb/ItemThumb'
import { useLongPress } from '@hooks/ui/useLongPress'
import type { MenuItem } from '@custom_types/product/menu-item'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './ProductCard.module.css'
import motion from '@styles/motion.module.css'

export type ProductCardProps = {
  item: MenuItem
  /** Position in the grid, only to stagger the entrance. */
  index: number
  onPick: (item: MenuItem) => void
}

/**
 * A menu item at the counter. Tap adds it to the sale; a long press peeks
 * at the product without adding it — the same look the operator would take
 * opening the menu, without leaving the sale in progress.
 */
export const ProductCard = ({ item, index, onPick }: ProductCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { isPressing, handlers } = useLongPress({
    onLongPress: () => setIsPreviewOpen(true),
    onRelease: () => setIsPreviewOpen(false),
  })

  const photo = item.images?.[0]?.url

  return (
    <>
      <Card
        variant="flat"
        onClick={() => onPick(item)}
        style={riseDelay(index * 25)}
        className={`${motion.settle} ${motion.press} ${styles.card} ${
          isPressing ? styles.pressing : ''
        }`}
        {...handlers}
      >
        <ItemThumb name={item.name} imageUrl={photo} className={styles.thumb} />
        <span className={styles.name}>{item.name}</span>
        <span className={styles.price}>{brl(item.price)}</span>
      </Card>

      {/*
       * Centered on screen with a blurred backdrop, like Instagram's photo
       * preview — and with no close button: the finger opened it, and
       * releasing closes it. An X here would be an impossible target to hit
       * without letting go of the gesture.
       *
       * Mounted only while open: Ark keeps dialog content in the DOM even
       * when closed, and the grid has dozens of items — that would mean
       * dozens of idle dialogs on the page for a preview shown one at a
       * time.
       */}
      {isPreviewOpen && (
        <Modal
          open
          onOpenChange={setIsPreviewOpen}
          dismissible={false}
          size="lg"
          ariaLabel={`Prévia de ${item.name}`}
          backdropClassName={styles.previewBackdrop}
          body={
            <Flexbox direction="column" gap={2}>
              {/* Same tile as the card, sized to look at: with no photo it
                  falls back to the category emoji instead of leaving a
                  hole. */}
              <ItemThumb
                name={item.name}
                imageUrl={photo}
                className={styles.previewPhoto}
              />
              <p className={styles.previewName}>{item.name}</p>
              {item.description && (
                <p className={styles.previewText}>{item.description}</p>
              )}
              <p className={styles.previewPrice}>{brl(item.price)}</p>
            </Flexbox>
          }
        />
      )}
    </>
  )
}
