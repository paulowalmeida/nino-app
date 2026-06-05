import type { ReactNode } from 'react'

export interface PageHeaderProps {
  /** Main page title */
  title: string
  /** Optional supporting description below the title */
  description?: string
  /** Actions aligned to the right (buttons, menus) */
  actions?: ReactNode
  /** Optional breadcrumb rendered above the title */
  breadcrumb?: ReactNode
  className?: string
}
