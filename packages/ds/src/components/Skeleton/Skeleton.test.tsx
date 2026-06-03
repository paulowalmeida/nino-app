import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './Skeleton'

describe(Skeleton.name, () => {
  it('renders with aria-hidden', () => {
    render(<Skeleton />)
    expect(document.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it.each(['rect', 'circle', 'text'] as const)(
    'renderiza variante %s sem erros',
    (variant) => {
      const { container } = render(<Skeleton variant={variant} />)
      expect(container.firstChild).toBeInTheDocument()
    }
  )

  it.each(['pulse', 'wave', 'none'] as const)(
    'renderiza animação %s sem erros',
    (animation) => {
      const { container } = render(<Skeleton animation={animation} />)
      expect(container.firstChild).toBeInTheDocument()
    }
  )

  it('applies animate-pulse by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('applies skeleton-wave when animation=wave', () => {
    const { container } = render(<Skeleton animation="wave" />)
    expect(container.firstChild).toHaveClass('skeleton-wave')
  })

  it('does not apply animation when animation=none', () => {
    const { container } = render(<Skeleton animation="none" />)
    expect(container.firstChild).not.toHaveClass('animate-pulse', 'skeleton-wave')
  })

  it('applies additional className', () => {
    const { container } = render(<Skeleton className="w-10 h-10" />)
    expect(container.firstChild).toHaveClass('w-10', 'h-10')
  })
})
