import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TableTabsList } from './TableTabsList'

describe(TableTabsList.name, () => {
  it('shows an open tab with its table and total', () => {
    render(
      <MemoryRouter>
        <TableTabsList
          openOrders={[
            {
              id: 'order-1',
              orderNumber: 42,
              tableNumber: 'Mesa 4',
              totalAmount: '35.50',
              items: [],
            } as never,
          ]}
          closedOrders={[]}
          isPending={false}
          isError={false}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
    expect(screen.getByText('R$ 35,50')).toBeInTheDocument()
    expect(screen.getByText('Comanda #42')).toBeInTheDocument()
  })

  it('switches between open and closed tabs', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TableTabsList
          openOrders={[]}
          closedOrders={[
            {
              id: 'order-2',
              orderNumber: 43,
              tableNumber: 'Mesa 7',
              totalAmount: '42.00',
              items: [],
            } as never,
          ]}
          isPending={false}
          isError={false}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Nenhuma comanda aberta.')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /Fechadas/ }))

    expect(screen.getByText('Mesa 7')).toBeInTheDocument()
  })
})
