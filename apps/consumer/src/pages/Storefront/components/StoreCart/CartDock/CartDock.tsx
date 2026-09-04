import type { MouseEvent } from 'react'

import {
  AnimatePresence,
  motion as motionEl,
  useReducedMotion,
} from 'framer-motion'

import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { AnimatedNumber } from '@shared/components/AnimatedNumber/AnimatedNumber'
import { brl } from '@utils/money'

import styles from './CartDock.module.css'

export const CartDock = () => {
  const {
    cartCount: count,
    cartTotal: total,
    setCartOpen,
  } = useStorefrontFacade()
  const onOpenCart = () => setCartOpen(true)
  const reduceMotion = useReducedMotion()

  const handleCtaClick = (event: MouseEvent) => {
    event.stopPropagation()
    onOpenCart()
  }

  return (
    <AnimatePresence>
      {count > 0 && (
        <motionEl.div
          className={styles.dock}
          onClick={onOpenCart}
          initial={reduceMotion ? false : { y: '130%' }}
          animate={{ y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { y: '130%' }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 300, damping: 21, mass: 1 }
          }
        >
          <Box className={styles.inner}>
            <Box className={styles.summary}>
              <Text as="span" className={styles.count}>
                {count} {count === 1 ? 'item' : 'itens'}
              </Text>
              <AnimatedNumber value={brl(total)} className={styles.total} />
            </Box>

            <Button className={styles.cta} onClick={handleCtaClick}>
              Ver sacola
            </Button>
          </Box>
        </motionEl.div>
      )}
    </AnimatePresence>
  )
}
