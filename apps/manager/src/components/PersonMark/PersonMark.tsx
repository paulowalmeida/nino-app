import { Avatar } from '@nino/ds/components/Avatar'
import { initialsOf } from '@utils/initials'

import styles from './PersonMark.module.css'

type PersonMarkProps = {
  name: string
  tone?: 'brand' | 'quiet' | 'night'
  size?: 'sm' | 'md'
  className?: string
}

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
