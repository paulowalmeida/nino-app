import type { MouseEvent } from 'react'
import { useHref, useNavigate } from 'react-router'

import { BackLink as DsBackLink } from '@nino/ds/components/BackLink'

type BackLinkProps = {
  to?: string
  children: string
}

export const BackLink = ({ to = '..', children }: BackLinkProps) => {
  const href = useHref(to, { relative: 'path' })
  const navigate = useNavigate()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    navigate(to, { relative: 'path' })
  }

  return (
    <DsBackLink href={href} onClick={handleClick}>
      {children}
    </DsBackLink>
  )
}
