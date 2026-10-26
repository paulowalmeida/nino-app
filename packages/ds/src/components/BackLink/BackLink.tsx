import { MouseEvent, ReactNode } from 'react'

import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './BackLink.module.css'

export type BackLinkProps = {
  href?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  children: ReactNode
  className?: string
}

export function BackLink({
  href,
  onClick,
  children,
  className,
}: BackLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={mergeClasses(styles.link, className)}
    >
      <Icon name="arrow-left" size="sm" />
      {children}
    </a>
  )
}
