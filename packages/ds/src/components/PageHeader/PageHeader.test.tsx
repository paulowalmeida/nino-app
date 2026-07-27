import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PageHeader } from './PageHeader'

describe(PageHeader.name, () => {
  it('renders the title as a heading', () => {
    render(<PageHeader title="Pedidos" />)
    expect(screen.getByRole('heading', { name: 'Pedidos' })).toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    render(<PageHeader title="Pedidos" description="Gerencie os pedidos" />)
    expect(screen.getByText('Gerencie os pedidos')).toBeInTheDocument()
  })

  it('renders actions', () => {
    render(<PageHeader title="Pedidos" actions={<button>Novo</button>} />)
    expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument()
  })

  it('keeps the whole title readable when accented', () => {
    render(<PageHeader title="Quem toca a equipe" accent="equipe" />)
    expect(
      screen.getByRole('heading', { name: 'Quem toca a equipe' })
    ).toBeInTheDocument()
  })

  it('wraps only the accent in its own element', () => {
    render(<PageHeader title="Meus dados" accent="dados" />)
    const mark = screen.getByText('dados')
    expect(mark.tagName).toBe('SPAN')
    expect(mark).toHaveClass('relative')
  })

  it('accents a title that is a single word', () => {
    render(<PageHeader title="Cardápio" accent="Cardápio" />)
    expect(screen.getByText('Cardápio').tagName).toBe('SPAN')
  })

  it('ignores an accent absent from the title', () => {
    render(<PageHeader title="Pedidos" accent="clientes" />)
    expect(screen.getByRole('heading', { name: 'Pedidos' })).toBeInTheDocument()
    expect(screen.queryByText('clientes')).not.toBeInTheDocument()
  })
})
