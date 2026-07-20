import type { NinoLogoProps } from './NinoLogo.types'
import styles from './NinoLogo.module.css'

const sizes = {
  sm: {
    mark: styles.markSm,
    letter: styles.letterSm,
    wordmark: styles.wordmarkSm,
    label: styles.labelSm,
  },
  md: {
    mark: styles.markMd,
    letter: styles.letterMd,
    wordmark: styles.wordmarkMd,
    label: styles.labelMd,
  },
  lg: {
    mark: styles.markLg,
    letter: styles.letterLg,
    wordmark: styles.wordmarkLg,
    label: styles.labelLg,
  },
}

export const NinoLogo = ({
  className,
  tone = 'dark',
  size = 'lg',
  mark,
}: NinoLogoProps) => {
  const variant = sizes[size]
  const labelColor = tone === 'light' ? styles.labelLight : styles.labelDark
  const markClass = mark ? styles.mark : `${styles.mark} ${variant.mark}`

  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      <span className={markClass}>
        {mark ?? (
          <>
            <span className={styles.markBg} />
            <span className={`${styles.letter} ${variant.letter}`}>n</span>
          </>
        )}
      </span>
      <span className={styles.stack}>
        <span className={`${styles.wordmark} ${variant.wordmark}`}>nino</span>
        <span className={`${styles.label} ${variant.label} ${labelColor}`}>
          BALCONISTA
        </span>
      </span>
    </div>
  )
}
