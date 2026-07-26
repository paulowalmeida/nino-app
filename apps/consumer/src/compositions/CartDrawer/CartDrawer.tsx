import { AnimatePresence, motion as motionEl } from 'framer-motion'

import { Button, Drawer } from '@nino/ds'

import { AnimatedNumber } from '@components/AnimatedNumber/AnimatedNumber'
import { categoryIcon } from '@utils/category-icon'
import { primaryImage } from '@utils/menu-image'
import { brl } from '@utils/money'

import type { CartDrawerProps } from './CartDrawer.types'

import styles from './CartDrawer.module.css'
import motion from '@styles/motion.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

export const CartDrawer = ({
  open,
  onOpenChange,
  lines,
  total,
  onIncrement,
  onDecrement,
  onClear,
  onCheckout,
}: CartDrawerProps) => (
  <Drawer
    open={open}
    onOpenChange={onOpenChange}
    placement="bottom"
    title="Sua sacola"
    size="85dvh"
    contentClassName={styles.drawer}
  >
    <div className={styles.body}>
      {lines.length === 0 ? (
        <div className={`${motion.riseIn} ${styles.empty}`}>
          <img
            src="/mascot-consumer.svg"
            alt=""
            className={styles.emptyMascot}
          />
          <p className={styles.emptyTitle}>Sua sacola está vazia</p>
          <p className={styles.emptyText}>
            Volte ao cardápio e escolha o que vai pedir.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.lines}>
            <AnimatePresence initial={false}>
              {lines.map(({ item, quantity }, index) => {
                const image = primaryImage(item)

                return (
                  <motionEl.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                    transition={{
                      duration: 0.28,
                      ease: EASE,
                      delay: index * 0.04,
                    }}
                    className={styles.line}
                  >
                    {image ? (
                      <img src={image} alt="" className={styles.photo} />
                    ) : (
                      <div className={styles.photoFallback} aria-hidden="true">
                        {categoryIcon(item.name) ?? '🍽️'}
                      </div>
                    )}

                    <div className={styles.lineText}>
                      <span className={styles.lineName}>{item.name}</span>
                      <span className={styles.linePrice}>
                        {brl(item.price)}
                      </span>
                    </div>

                    <div className={styles.stepper}>
                      <Button
                        size="icon"
                        variant="outline"
                        className={styles.stepperBtn}
                        aria-label={`Remover uma unidade de ${item.name}`}
                        onClick={() => onDecrement(item.id)}
                      >
                        −
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
                        +
                      </Button>
                    </div>
                  </motionEl.div>
                )
              })}
            </AnimatePresence>
          </div>

          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <AnimatedNumber value={brl(total)} className={styles.total} />
            </div>
            <Button className={styles.checkout} onClick={onCheckout}>
              Finalizar pedido
            </Button>
            <Button variant="ghost" className={styles.clear} onClick={onClear}>
              Esvaziar sacola
            </Button>
          </div>
        </>
      )}
    </div>
  </Drawer>
)
