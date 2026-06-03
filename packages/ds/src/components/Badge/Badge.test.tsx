import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './Badge'

describe(Badge.name, () => {
  it('renders the content', () => {
    render(<Badge>Ativo</Badge>)
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it.each(['default', 'success', 'error', 'warning', 'info'] as const)(
    'renderiza variante %s sem erros',
    (variant) => {
      render(<Badge variant={variant}>label</Badge>)
      expect(screen.getByText('label')).toBeInTheDocument()
    }
  )

  it.each(['sm', 'md'] as const)('renderiza tamanho %s sem erros', (size) => {
    render(<Badge size={size}>label</Badge>)
    expect(screen.getByText('label')).toBeInTheDocument()
  })
})
