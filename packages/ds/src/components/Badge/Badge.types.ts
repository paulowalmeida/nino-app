import { HTMLAttributes } from 'react'

export type BadgeVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}
