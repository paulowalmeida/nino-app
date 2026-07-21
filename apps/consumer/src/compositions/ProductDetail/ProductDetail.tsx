import { useState } from 'react'

import { Button, Carousel, Drawer } from '@nino/ds'

import { brl } from '@utils/money'

import type { ProductDetailProps } from './ProductDetail.types'

import styles from './ProductDetail.module.css'

export const ProductDetail = ({
  item,
  onClose,
  onConfirm,
}: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1)

  /**
   * O Drawer anima a saída antes de desmontar — sem isso o conteúdo
   * some (item vira null) antes da transição terminar, e a folha fecha
   * vazia.
   */
  const [shown, setShown] = useState(item)
  if (item && item !== shown) {
    setShown(item)
    setQuantity(1)
  }

  if (!shown) return null

  const images = shown.images.length > 0 ? shown.images : null

  return (
    <Drawer
      open={item !== null}
      onOpenChange={(open) => !open && onClose()}
      placement="bottom"
      title={shown.name}
      size="90dvh"
      contentClassName={styles.drawer}
    >
      <div className={styles.media}>
        {images ? (
          <Carousel
            slides={images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt=""
                className={styles.photo}
              />
            ))}
          />
        ) : (
          <div className={styles.photoFallback} aria-hidden="true" />
        )}
      </div>

      {shown.description && (
        <p className={styles.description}>{shown.description}</p>
      )}

      <div className={styles.footer}>
        <div className={styles.stepper}>
          <Button
            size="icon"
            variant="outline"
            aria-label="Diminuir quantidade"
            disabled={quantity <= 1}
            onClick={() => setQuantity((n) => Math.max(1, n - 1))}
          >
            −
          </Button>
          <span className={styles.stepperCount}>{quantity}</span>
          <Button
            size="icon"
            variant="outline"
            aria-label="Aumentar quantidade"
            onClick={() => setQuantity((n) => n + 1)}
          >
            +
          </Button>
        </div>

        <Button
          className={styles.confirm}
          onClick={() => onConfirm(shown, quantity)}
        >
          Adicionar — {brl(Number(shown.price) * quantity)}
        </Button>
      </div>
    </Drawer>
  )
}
