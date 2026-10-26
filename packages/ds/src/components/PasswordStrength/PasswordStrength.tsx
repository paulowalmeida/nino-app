import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'
import {
  getPasswordStrength,
  PasswordStrengthLevel,
} from '@ds/lib/passwordStrength/passwordStrength'

import styles from './PasswordStrength.module.css'

type PasswordStrengthProps = {
  /** What was typed. Read on every keystroke; nothing is stored */
  password: string
  /** Spacing decided by whoever mounts it */
  className?: string
}

const labels: Record<PasswordStrengthLevel, string> = {
  weak: 'Fraca',
  medium: 'Média',
  strong: 'Forte',
}

const fillClasses: Record<PasswordStrengthLevel, string> = {
  weak: styles.fillWeak,
  medium: styles.fillMedium,
  strong: styles.fillStrong,
}

const textClasses: Record<PasswordStrengthLevel, string> = {
  weak: styles.labelWeak,
  medium: styles.labelMedium,
  strong: styles.labelStrong,
}

const segmentsByLevel: Record<PasswordStrengthLevel, number> = {
  weak: 1,
  medium: 2,
  strong: 3,
}

/**
 * Three bars filling up as the password gets stronger, with the verdict in
 * words beside them.
 *
 * The colour alone would leave out whoever cannot tell red from green, so
 * the word carries the same message — and a screen reader hears the word
 * too, not "1 of 3".
 *
 * ```tsx
 * <PasswordStrength password={password} className={styles.strength} />
 * ```
 */
export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  const { level } = getPasswordStrength(password)
  const filled = segmentsByLevel[level]

  return (
    <div className={mergeClasses(styles.meter, className)}>
      <div
        className={styles.segmentRow}
        role="meter"
        aria-label="Força da senha"
        aria-valuenow={filled}
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuetext={labels[level]}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className={styles.segmentTrack}>
            {i < filled && (
              <div
                className={mergeClasses(styles.segmentFill, fillClasses[level])}
              />
            )}
          </div>
        ))}
      </div>
      <span className={mergeClasses(styles.label, textClasses[level])}>
        {labels[level]}
      </span>
    </div>
  )
}
