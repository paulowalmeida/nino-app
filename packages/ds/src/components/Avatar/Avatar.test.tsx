import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Avatar } from './Avatar'

describe(Avatar.name, () => {
  it('renders initials fallback', () => {
    render(<Avatar fallback="AB" />)
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('renders default icon when no fallback is provided', () => {
    const { container } = render(<Avatar />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders image when src is provided', () => {
    render(<Avatar src="/foto.jpg" alt="Foto do usuário" fallback="FU" />)
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
  })

  it.each(['sm', 'md', 'lg', 'xl'] as const)(
    'renderiza tamanho %s sem erros',
    (size) => {
      const { container } = render(<Avatar size={size} fallback="AB" />)
      expect(container.firstChild).toBeInTheDocument()
    }
  )

  it('applies additional className', () => {
    const { container } = render(<Avatar className="ring-2" fallback="AB" />)
    expect(container.firstChild).toHaveClass('ring-2')
  })
})
