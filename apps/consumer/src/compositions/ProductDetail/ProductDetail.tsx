import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Carousel } from '@nino/ds/components/Carousel'
import { Drawer } from '@nino/ds/components/Drawer'
import { Image } from '@nino/ds/components/Image'
import { Modal } from '@nino/ds/components/Modal'
import { QuantityStepper } from '@nino/ds/components/QuantityStepper'
import { AnimatedNumber } from '@elements/AnimatedNumber/AnimatedNumber'
import { useIsDesktop } from '@hooks/useIsDesktop'
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'
import type { MenuItem } from '@custom_types/menu/menu-item'

import styles from './ProductDetail.module.css'
import motion from '@styles/motion.module.css'

type ProductDetailProps = {
  item: MenuItem | null
  onClose: () => void
  onConfirm: (item: MenuItem, quantity: number) => void
}

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

  /**
   * Modal/Drawer ficam montados desde o primeiro render, fechados. Montar
   * um diálogo do Ark já com `open` verdadeiro registra o bloqueio de
   * ponteiro no body mas não a transição que o desfaz — o body fica com
   * `pointer-events: none` para sempre e a página inteira para de
   * responder ao clique.
   */
  const isOpen = item !== null

  const images = shown && shown.images.length > 0 ? shown.images : null

  const fallback = (
    <div className={styles.photoFallback} aria-hidden="true">
      <span className={styles.fallbackGlyph}>
        {(shown ? categoryIcon(shown.name) : null) ?? '🍽️'}
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
  const reveal = shown ? (
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
      Adicionar {' '}
      <AnimatedNumber value={brl(Number(shown.price) * quantity)} />
    </Button>
  ) : null

  if (isDesktop) {
    return (
      <Modal
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
        size="md"
        ariaLabel={shown?.name ?? ''}
        header={
          shown ? <h2 className={styles.modalTitle}>{shown.name}</h2> : null
        }
        body={
          shown ? (
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
          ) : null
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
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      placement="bottom"
      title={shown?.name ?? ''}
      size="auto"
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
