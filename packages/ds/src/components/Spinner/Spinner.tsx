import { AnimatePresence, motion } from 'framer-motion'

import { SpinnerProps } from './Spinner.types'

/**
 * Animated loading indicator.
 * Uses `AnimatePresence` to smoothly animate enter and exit transitions.
 *
 * @param visible - Controls visibility with enter/exit animation
 * @param size - Size in pixels. Default: 16
 * @param label - Accessible label for screen readers. Default: 'Loading'
 */
export function Spinner({ visible, size = 16, label = 'Loading' }: SpinnerProps) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.svg
          key="spinner"
          role="status"
          aria-label={label}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          initial={{ opacity: 0, scale: 0.5 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </motion.svg>
      )}
    </AnimatePresence>
  )
}
