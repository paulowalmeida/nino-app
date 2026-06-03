import { HTMLAttributes } from 'react'

export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}
