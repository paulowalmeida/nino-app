import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TableTabsList } from './TableTabsList'

describe(TableTabsList.name, () => {
  it('shows cards skeleton while loading the tabs', () => {
    render(
      <MemoryRouter>
        <TableTabsList
          openOrders={[]}
          closedOrders={[]}
          isPending
          isError={false}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('status')).toHaveTextContent('Carregando comandas')
  })

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

  it('filters the selected comandas by name or table', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TableTabsList
          openOrders={[
            {
              id: 'order-1',
              orderNumber: 42,
              guestName: 'Ana Souza',
              tableNumber: 'Mesa 4',
              totalAmount: '35.50',
              items: [],
            } as never,
            {
              id: 'order-2',
              orderNumber: 43,
              guestName: 'Bruno Lima',
              tableNumber: 'Mesa 12',
              totalAmount: '42.00',
              items: [],
            } as never,
          ]}
          closedOrders={[]}
          isPending={false}
          isError={false}
        />
      </MemoryRouter>
    )

    const search = screen.getByRole('searchbox', {
      name: 'Buscar comandas por nome, mesa ou número da comanda',
    })
    await user.type(search, '12')

    expect(screen.queryByText('Mesa 4')).not.toBeInTheDocument()
    expect(screen.getByText('Mesa 12')).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'ana')

    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
    expect(screen.queryByText('Mesa 12')).not.toBeInTheDocument()
  })

  it('searches open and closed comandas together', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TableTabsList
          openOrders={[
            {
              id: 'open-order',
              orderNumber: 44,
              guestName: 'Ana Souza',
              tableNumber: 'Mesa 4',
              totalAmount: '35.50',
              items: [],
            } as never,
          ]}
          closedOrders={[
            {
              id: 'closed-order',
              orderNumber: 45,
              guestName: 'Carlos Lima',
              tableNumber: 'Mesa 9',
              totalAmount: '42.00',
              items: [],
            } as never,
          ]}
          isPending={false}
          isError={false}
        />
      </MemoryRouter>
    )

    await user.type(
      screen.getByRole('searchbox', {
        name: 'Buscar comandas por nome, mesa ou número da comanda',
      }),
      'carlos'
    )

    expect(screen.getByText('Mesa 9')).toBeInTheDocument()
    expect(screen.getByText('Fechada')).toBeInTheDocument()
  })
})
