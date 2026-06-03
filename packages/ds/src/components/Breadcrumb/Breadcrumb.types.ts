import { MouseEvent, ReactNode } from 'react'

export interface BreadcrumbItem {
  label: ReactNode
  href?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: ReactNode
  className?: string
}
