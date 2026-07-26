import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import type { AnimatedNumberProps } from './AnimatedNumber.types'

import styles from './AnimatedNumber.module.css'

/**
 * Troca de valor sem corte seco: o dígito velho sai, o novo entra por cima,
 * no mesmo lugar. Usado onde um número muda sozinho (quantidade, total) e
 * precisaria de um pulo — sem isso o olho perde o que mudou.
 */
export const AnimatedNumber = ({ value, className }: AnimatedNumberProps) => {
  const reduceMotion = useReducedMotion()

  return (
    <span className={`${styles.wrap} ${className ?? ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.9 }}
          transition={{
            duration: reduceMotion ? 0 : 0.22,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
