import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Alert } from './Alert'

describe(Alert.name, () => {
  it('renders with role alert', () => {
    render(<Alert>Mensagem</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders the content', () => {
    render(<Alert>Algo deu errado</Alert>)
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
  })

  it('renders the title when provided', () => {
    render(<Alert title="Erro">Descrição</Alert>)
    expect(screen.getByText('Erro')).toBeInTheDocument()
    expect(screen.getByText('Descrição')).toBeInTheDocument()
  })

  it('does not render title when omitted', () => {
    render(<Alert>Só descrição</Alert>)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it.each(['info', 'success', 'warning', 'error'] as const)(
    'renderiza variante %s sem erros',
    (variant) => {
      render(<Alert variant={variant}>msg</Alert>)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    }
  )

  it('applies additional className', () => {
    render(<Alert className="mt-4">msg</Alert>)
    expect(screen.getByRole('alert')).toHaveClass('mt-4')
  })
})
