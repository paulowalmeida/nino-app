import { Avatar } from '@nino/ds/components/Avatar'
import { initialsOf } from '@utils/initials'

import type { PersonMarkProps } from './PersonMark.types'

import styles from './PersonMark.module.css'

/**
 * Initials disc — the stand-in for a photo the panel never asks for.
 * Wraps the DS `Avatar` and adds what it has no notion of: the initials, the
 * tone that says who the person is to the panel, and the decorative role —
 * the name always sits right next to the disc, so readers skip it.
 */
export const PersonMark = ({
  name,
  tone = 'brand',
  size = 'md',
  className,
}: PersonMarkProps) => (
  <Avatar
    aria-hidden="true"
    size={size}
    fallback={initialsOf(name)}
    className={className ? `${styles[tone]} ${className}` : styles[tone]}
  />
)
