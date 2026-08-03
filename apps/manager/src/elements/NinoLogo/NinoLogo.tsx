import { useHref, useNavigate } from 'react-router'

import type { MouseEvent, ReactNode } from 'react'

import { NinoLogo as DsNinoLogo } from '@nino/ds/components/NinoLogo'

type NinoLogoProps = {
  className?: string
  tone?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  mark?: ReactNode
  to?: string
  hideWordmark?: boolean
}

export const NinoLogo = ({ to, ...props }: NinoLogoProps) => {
  const href = useHref(to ?? '', { relative: 'path' })
  const navigate = useNavigate()

  const handleClick = to
    ? (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        navigate(to, { relative: 'path' })
      }
    : undefined

  return (
    <DsNinoLogo
      {...props}
      label="GESTOR"
      href={to ? href : undefined}
      onClick={handleClick}
      ariaLabel="Ir para a visão geral"
    />
  )
}
