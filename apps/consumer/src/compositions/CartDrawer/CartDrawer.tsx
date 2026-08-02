import { useState } from 'react'

import { AnimatePresence, motion as motionEl } from 'framer-motion'

import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { Drawer } from '@nino/ds/components/Drawer'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Image } from '@nino/ds/components/Image'
import { AnimatedNumber } from '@components/AnimatedNumber/AnimatedNumber'
import { Icon } from '@components/Icon/Icon'
import { useIsDesktop } from '@hooks/useIsDesktop'
import { categoryIcon } from '@utils/category-icon'
import { primaryImage } from '@utils/menu-image'
import { brl } from '@utils/money'
import minusIcon from '@assets/icons/minus.svg?raw'
import plusIcon from '@assets/icons/plus.svg?raw'

import type { CartDrawerProps } from './CartDrawer.types'

import styles from './CartDrawer.module.css'
import motion from '@styles/motion.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

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
  const [confirmingClear, setConfirmingClear] = useState(false)

  const handleConfirmClear = () => {
    setConfirmingClear(false)
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
                                <TrashIcon />
                              ) : (
                                <Icon svg={minusIcon} />
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
                              <Icon svg={plusIcon} />
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
                  onClick={() => setConfirmingClear(true)}
                >
                  Esvaziar sacola
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>

      {confirmingClear && (
        <Dialog
          open
          onOpenChange={(open) => !open && setConfirmingClear(false)}
          title="Esvaziar a sacola?"
          description="Todos os itens serão removidos. Não dá para desfazer."
          confirmLabel="Esvaziar"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmClear}
          onCancel={() => setConfirmingClear(false)}
        />
      )}
    </>
  )
}
