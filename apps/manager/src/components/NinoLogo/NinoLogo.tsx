import { Link } from 'react-router'

import type { ReactNode } from 'react'

import styles from './NinoLogo.module.css'
import type { NinoLogoProps } from './NinoLogo.types'

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
  to,
  hideWordmark = false,
}: NinoLogoProps) => {
  const variant = sizes[size]
  const labelColor = tone === 'light' ? styles.labelLight : styles.labelDark
  const markClass = mark ? styles.mark : `${styles.mark} ${variant.mark}`

  const content: ReactNode = (
    <>
      <span className={markClass}>
        {mark ?? (
          <>
            <span className={styles.markBg} />
            <span className={`${styles.letter} ${variant.letter}`}>n</span>
          </>
        )}
      </span>
      {!hideWordmark && (
        <span className={styles.stack}>
          <span className={`${styles.wordmark} ${variant.wordmark}`}>
            nino
          </span>
          <span className={`${styles.label} ${variant.label} ${labelColor}`}>
            GESTOR
          </span>
        </span>
      )}
    </>
  )

  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      {to ? (
        <Link
          to={to}
          className={styles.link}
          aria-label="Ir para a visão geral"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}
