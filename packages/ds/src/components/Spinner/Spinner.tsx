import { AnimatePresence, motion } from 'framer-motion'

import { SpinnerProps } from './Spinner.types'

/**
 * Animated loading indicator.
 * Uses `AnimatePresence` to smoothly animate enter and exit transitions.
 *
 * @param visible - Controls visibility with enter/exit animation
 * 
 * @param size - Size in pixels. Default: 16
 * 
 * @param label - Accessible label for screen readers. Default: 'Loading'
 */
export function Spinner({ visible, size = 16, label = 'Loading' }: SpinnerProps) {
  return (
    <AnimatePresence initial={true}>
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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            rotate: { duration: 0.8, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 0.15 },
            scale: { duration: 0.15 },
          }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </motion.svg>
      )}
    </AnimatePresence>
  )
}
