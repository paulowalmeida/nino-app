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
})
