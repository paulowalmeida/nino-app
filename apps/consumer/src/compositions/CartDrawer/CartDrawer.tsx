import { useState } from 'react'

import { AnimatePresence, motion as motionEl } from 'framer-motion'

import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { Drawer } from '@nino/ds/components/Drawer'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Image } from '@nino/ds/components/Image'
import { AnimatedNumber } from '@elements/AnimatedNumber/AnimatedNumber'
import { Icon } from '@nino/ds/components/Icon'
import { useIsDesktop } from '@hooks/useIsDesktop'
import { categoryIcon } from '@utils/category-icon'
import { primaryImage } from '@utils/menu-image'
import { brl } from '@utils/money'
import type { CartLine } from '@custom_types/cart/cart-line'

import styles from './CartDrawer.module.css'
import motion from '@styles/motion.module.css'

type CartDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  lines: CartLine[]
  total: number
  /** Prazo da loja, o mesmo do cabeçalho — some quando não está configurado. */
  estimatedMinutes?: number
  onIncrement: (itemId: string) => void
  onDecrement: (itemId: string) => void
  onClear: () => void
  onCheckout: () => void
}

const EASE = [0.16, 1, 0.3, 1] as const

export const CartDrawer = ({
  open,
  onOpenChange,
  lines,
  total,
  estimatedMinutes,
  onIncrement,
  onDecrement,
  onClear,
  onCheckout,
}: CartDrawerProps) => {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const isDesktop = useIsDesktop()
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)

  const handleConfirmClear = () => {
    setIsConfirmingClear(false)
    onClear()
  }

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        placement={isDesktop ? 'right' : 'bottom'}
        title="Sua sacola"
        description={
          lines.length === 0
            ? undefined
            : `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`
        }
        size={isDesktop ? '25rem' : 'auto'}
        contentClassName={isDesktop ? styles.panel : styles.sheet}
      >
        <div className={styles.body}>
          {lines.length === 0 ? (
            <EmptyState
              size="md"
              className={`${motion.riseIn} ${styles.empty}`}
              illustration={<img src="/mascot-consumer.svg" alt="" />}
              title="Sua sacola está vazia"
            >
              Volte ao cardápio e escolha o que vai pedir.
            </EmptyState>
          ) : (
            <>
              <div className={styles.lines}>
                <AnimatePresence initial={false}>
                  {lines.map(({ item, quantity }, index) => {
                    const image = primaryImage(item)
                    const isLast = quantity === 1

                    return (
                      <motionEl.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -24,
                          height: 0,
                          marginBottom: 0,
                        }}
                        transition={{
                          duration: 0.28,
                          ease: EASE,
                          delay: index * 0.04,
                        }}
                        className={styles.line}
                      >
                        <Image
                          src={image}
                          alt=""
                          className={styles.photo}
                          wrapperClassName={styles.photoWrap}
                          placeholder={
                            <div
                              className={styles.photoFallback}
                              aria-hidden="true"
                            >
                              {categoryIcon(item.name) ?? '🍽️'}
                            </div>
                          }
                        />

                        <div className={styles.lineText}>
                          <span className={styles.lineName}>{item.name}</span>
                          <span className={styles.lineMath}>
                            {quantity} × {brl(item.price)}
                          </span>
                        </div>

                        <div className={styles.lineRight}>
                          <AnimatedNumber
                            value={brl(Number(item.price) * quantity)}
                            className={styles.lineTotal}
                          />

                          <div className={styles.stepper}>
                            <Button
                              size="icon"
                              variant="outline"
                              className={styles.stepperBtn}
                              aria-label={
                                isLast
                                  ? `Remover ${item.name} da sacola`
                                  : `Remover uma unidade de ${item.name}`
                              }
                              onClick={() => onDecrement(item.id)}
                            >
                              {isLast ? (
                                <Icon name="trash" size="sm" />
                              ) : (
                                <Icon name="minus" size="sm" />
                              )}
                            </Button>
                            <AnimatedNumber
                              value={quantity}
                              className={styles.stepperCount}
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              className={styles.stepperBtn}
                              aria-label={`Adicionar mais uma unidade de ${item.name}`}
                              onClick={() => onIncrement(item.id)}
                            >
                              <Icon name="plus" size="sm" />
                            </Button>
                          </div>
                        </div>
                      </motionEl.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <div>
                    <p className={styles.totalLabel}>Total</p>
                    {estimatedMinutes ? (
                      <p className={styles.totalEta}>
                        pronto em ~{estimatedMinutes} min
                      </p>
                    ) : null}
                  </div>
                  <AnimatedNumber value={brl(total)} className={styles.total} />
                </div>
                <Button className={styles.checkout} onClick={onCheckout}>
                  Finalizar pedido
                </Button>
                <Button
                  variant="ghost"
                  className={styles.clear}
                  onClick={() => setIsConfirmingClear(true)}
                >
                  Esvaziar sacola
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>

      {isConfirmingClear && (
        <Dialog
          open
          onOpenChange={(open) => !open && setIsConfirmingClear(false)}
          title="Esvaziar a sacola?"
          description="Todos os itens serão removidos. Não dá para desfazer."
          confirmLabel="Esvaziar"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmClear}
          onCancel={() => setIsConfirmingClear(false)}
        />
      )}
    </>
  )
}
