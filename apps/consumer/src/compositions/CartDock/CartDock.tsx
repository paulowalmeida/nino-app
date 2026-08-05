import { AnimatePresence, motion as motionEl, useReducedMotion } from 'framer-motion'

import { Button } from '@nino/ds/components/Button'
import { AnimatedNumber } from '@elements/AnimatedNumber/AnimatedNumber'
import { brl } from '@utils/money'

import styles from './CartDock.module.css'

type CartDockProps = {
  count: number
  total: number
  onOpenCart: () => void
}

/*
 * A comanda sobe do rodapé com uma quicada curta em vez de aparecer pronta:
 * é a única confirmação de que o toque no "+" virou item, e um elemento que
 * brota sem movimento não é lido como resposta ao gesto — parece que sempre
 * esteve lá.
 *
 * `AnimatePresence` porque ela também precisa sair andando quando a sacola
 * esvazia; desmontar seco seria o mesmo susto ao contrário.
 */
export const CartDock = ({ count, total, onOpenCart }: CartDockProps) => {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {count > 0 && (
        <motionEl.div
          className={styles.dock}
          initial={reduceMotion ? false : { y: '130%' }}
          animate={{ y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { y: '130%' }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 300, damping: 21, mass: 1 }
          }
        >
          <div className={styles.inner}>
            <div className={styles.summary}>
              <span className={styles.count}>
                {count} {count === 1 ? 'item' : 'itens'}
              </span>
              <AnimatedNumber value={brl(total)} className={styles.total} />
            </div>

            <Button className={styles.cta} onClick={onOpenCart}>
              Ver sacola
            </Button>
          </div>
        </motionEl.div>
      )}
    </AnimatePresence>
  )
}
