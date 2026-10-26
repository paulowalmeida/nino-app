import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrdersHeader } from './OrdersHeader'

describe('OrdersHeader', () => {
  it('presents the account orders introduction', () => {
    render(<OrdersHeader />)

    expect(screen.getByText('Pedidos')).toBeInTheDocument()
    expect(screen.getByText('Tudo que você já pediu aqui')).toBeInTheDocument()
    expect(
      screen.getByText(/Toque em um pedido para ver a comanda/)
    ).toBeInTheDocument()
  })
})
