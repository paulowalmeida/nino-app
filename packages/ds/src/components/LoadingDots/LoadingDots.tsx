import { motion } from 'framer-motion'

import { LoadingDotsProps } from './LoadingDots.types'

const baseWrapper = 'inline-flex items-center gap-1'
const baseDot = 'block h-1.5 w-1.5 rounded-full bg-current'

/**
 * Three-dot loading indicator with staggered bounce animation.
 * Use inside Button via `loadingIndicator="dots"` or standalone.
 *
 * @param visible - Controls visibility with enter/exit animation
 * @param label - Accessible label for screen readers. Default: 'Loading'
 */
export function LoadingDots({ visible, label = 'Loading' }: LoadingDotsProps) {
  if (!visible) return null

  return (
    <span role="status" aria-label={label} className={baseWrapper}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
            repeatDelay: 0.4,
          }}
          className={baseDot}
        />
      ))}
    </span>
  )
}
