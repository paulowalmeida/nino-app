import { MouseEvent, ReactNode } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

export interface BackLinkProps {
  href?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  children: ReactNode
  className?: string
}

const baseLink =
  '-ml-2 inline-flex h-11 items-center gap-2 rounded-full px-3 text-base ' +
  'font-semibold text-subtle transition-colors duration-150 ' +
  'hover:bg-brand-foreground/70 hover:text-brand-strong ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ' +
  'focus-visible:ring-offset-1 active:scale-[0.97] ' +
  'motion-reduce:transition-none motion-reduce:active:scale-100'

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
      className={mergeClasses(baseLink, className)}
    >
      <span aria-hidden="true" className="text-lg leading-none">
        ←
      </span>
      {children}
    </a>
  )
}
