import { HTMLAttributes, ReactNode } from 'react'

export type EmptyStateSize = 'sm' | 'md'

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  /** Illustration or icon shown above the title. Only rendered at `md`. */
  illustration?: ReactNode
  /** Short heading naming what is missing. */
  title?: string
  /** Call to action — a button or link out of the dead end. */
  action?: ReactNode
  /** `sm` sits inside a card or list; `md` fills the screen. Default: `sm` */
  size?: EmptyStateSize
}
