import { useState } from 'react'

import { Button, Carousel, Drawer, Image, Modal } from '@nino/ds'

import { AnimatedNumber } from '@components/AnimatedNumber/AnimatedNumber'
import { useIsDesktop } from '@hooks/useIsDesktop'
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import type { ProductDetailProps } from './ProductDetail.types'

import styles from './ProductDetail.module.css'
import motion from '@styles/motion.module.css'

export const ProductDetail = ({
  item,
  onClose,
  onConfirm,
}: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1)
  const isDesktop = useIsDesktop()

  /**
   * Drawer/Modal animam a saída antes de desmontar — sem isso o conteúdo
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

  const fallback = (
    <div className={styles.photoFallback} aria-hidden="true">
      <span className={styles.fallbackGlyph}>
        {categoryIcon(shown.name) ?? '🍽️'}
      </span>
    </div>
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

  /**
   * `key={shown.id}` força o remount ao trocar de item: sem isso o CSS de
   * entrada não reinicia, porque o mesmo nó de DOM continua ali.
   */
  const reveal = (
    <div key={shown.id}>
      <div className={`${motion.riseIn} ${styles.media}`}>{media}</div>
      {shown.description && (
        <p
          className={`${motion.riseIn} ${styles.description}`}
          style={riseDelay(70)}
        >
          {shown.description}
        </p>
      )}
    </div>
  )

  const stepper = (
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
      <AnimatedNumber value={quantity} className={styles.stepperCount} />
      <Button
        size="icon"
        variant="outline"
        aria-label="Aumentar quantidade"
        onClick={() => setQuantity((n) => n + 1)}
      >
        +
      </Button>
    </div>
  )

  const confirmButton = (
    <Button className={styles.confirm} onClick={() => onConfirm(shown, quantity)}>
      Adicionar —{' '}
      <AnimatedNumber value={brl(Number(shown.price) * quantity)} />
    </Button>
  )

  if (isDesktop) {
    return (
      <Modal
        open={item !== null}
        onOpenChange={(open) => !open && onClose()}
        size="md"
        ariaLabel={shown.name}
        header={<h2 className={styles.modalTitle}>{shown.name}</h2>}
        body={
          <div key={shown.id}>
            <div className={`${motion.riseIn} ${styles.modalMedia}`}>
              {media}
            </div>
            {shown.description && (
              <p
                className={`${motion.riseIn} ${styles.description}`}
                style={riseDelay(70)}
              >
                {shown.description}
              </p>
            )}
          </div>
        }
        footer={
          <div className={styles.modalFooter}>
            {stepper}
            {confirmButton}
          </div>
        }
      />
    )
  }

  return (
    <Drawer
      open={item !== null}
      onOpenChange={(open) => !open && onClose()}
      placement="bottom"
      title={shown.name}
      size="90dvh"
      contentClassName={styles.drawer}
    >
      {reveal}

      <div className={styles.footer}>
        {stepper}
        {confirmButton}
      </div>
    </Drawer>
  )
}
