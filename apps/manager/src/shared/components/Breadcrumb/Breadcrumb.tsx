import type { MouseEvent } from 'react'
import { resolvePath, useLocation, useNavigate } from 'react-router'

import { Breadcrumb as DsBreadcrumb } from '@nino/ds/components/Breadcrumb'

type Crumb = {
  label: string
  to?: string
}

type BreadcrumbProps = {
  trail: Crumb[]
}

export const Breadcrumb = ({ trail }: BreadcrumbProps) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const items = trail.map(({ label, to }) => ({
    label,
    href: to ? resolvePath(to, pathname).pathname : undefined,
    onClick: to
      ? (event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault()
          navigate(to, { relative: 'path' })
        }
      : undefined,
  }))

  return <DsBreadcrumb items={items} ariaLabel="Você está em" />
}
