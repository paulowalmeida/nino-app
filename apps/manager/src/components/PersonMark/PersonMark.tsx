import { initialsOf } from '@utils/initials'

import type { PersonMarkProps } from './PersonMark.types'

import styles from './PersonMark.module.css'

/** Initials disc — the stand-in for a photo the panel never asks for. */
export const PersonMark = ({
  name,
  tone = 'brand',
  size = 'md',
  className,
}: PersonMarkProps) => (
  <span
    aria-hidden="true"
    className={`${styles.mark} ${styles[tone]} ${styles[size]} ${
      className ?? ''
    }`}
  >
    {initialsOf(name)}
  </span>
)
