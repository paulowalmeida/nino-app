import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TableTabsList } from './TableTabsList'

describe(TableTabsList.name, () => {
  it('shows an open tab with its table and total', () => {
    render(
      <MemoryRouter>
        <TableTabsList
          orders={[
            {
              id: 'order-1',
              orderNumber: 42,
              tableNumber: 'Mesa 4',
              totalAmount: '35.50',
            } as never,
          ]}
          isPending={false}
          isError={false}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
    expect(screen.getByText('R$ 35,50')).toBeInTheDocument()
  })
})
