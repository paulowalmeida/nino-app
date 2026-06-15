import styles from "./NinoLogo.module.css"
import type { NinoLogoProps } from "./NinoLogo.types"

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

export function NinoLogo({
  className,
  tone = "dark",
  size = "lg",
  mark,
}: NinoLogoProps) {
  const s = sizes[size]
  const labelColor = tone === "light" ? styles.labelLight : styles.labelDark
  const markCls = mark ? styles.mark : `${styles.mark} ${s.mark}`

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      <span className={markCls}>
        {mark ?? (
          <>
            <span className={styles.markBg} />
            <span className={`${styles.letter} ${s.letter}`}>n</span>
          </>
        )}
      </span>
      <span className={styles.stack}>
        <span className={`${styles.wordmark} ${s.wordmark}`}>nino</span>
        <span className={`${styles.label} ${s.label} ${labelColor}`}>
          GESTOR
        </span>
      </span>
    </div>
  )
}
