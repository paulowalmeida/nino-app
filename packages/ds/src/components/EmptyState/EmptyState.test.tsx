import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'

describe(EmptyState.name, () => {
  it('renders the supporting text', () => {
    render(<EmptyState>Nenhum telefone cadastrado.</EmptyState>)
    expect(screen.getByText('Nenhum telefone cadastrado.')).toBeInTheDocument()
  })

  it('renders the title when provided', () => {
    render(<EmptyState title="Sacola vazia">Volte ao cardápio.</EmptyState>)
    expect(screen.getByText('Sacola vazia')).toBeInTheDocument()
    expect(screen.getByText('Volte ao cardápio.')).toBeInTheDocument()
  })

  it('renders the action when provided', () => {
    render(<EmptyState action={<button>Ver cardápio</button>} />)
    expect(
      screen.getByRole('button', { name: 'Ver cardápio' })
    ).toBeInTheDocument()
  })

  it('does not announce itself like an alert does', () => {
    render(<EmptyState>Nada por aqui.</EmptyState>)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('hides the illustration from assistive tech', () => {
    const { container } = render(
      <EmptyState size="md" illustration={<img src="/m.svg" alt="" />}>
        Nada por aqui.
      </EmptyState>
    )
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('drops the illustration at the compact size', () => {
    render(
      <EmptyState illustration={<img src="/m.svg" alt="mascote" />}>
        Nada por aqui.
      </EmptyState>
    )
    expect(screen.queryByAltText('mascote')).not.toBeInTheDocument()
  })

  it('forwards extra props to the root element', () => {
    render(<EmptyState data-testid="holder">Nada.</EmptyState>)
    expect(screen.getByTestId('holder')).toBeInTheDocument()
  })

  it.each(['sm', 'md'] as const)('renders size %s without errors', (size) => {
    render(<EmptyState size={size}>Nada por aqui.</EmptyState>)
    expect(screen.getByText('Nada por aqui.')).toBeInTheDocument()
  })
})
