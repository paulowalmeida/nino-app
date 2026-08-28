import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { KitchenColumn } from './KitchenColumn'
import { kitchenColumnMock } from './KitchenColumn.mock'

vi.mock('@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade', () => ({
  useKitchenFacade: () => ({
    orders: [],
    isPending: false,
    advanceOrder: vi.fn(),
    isAdvancing: false,
  }),
}))

describe(KitchenColumn.name, () => {
  it('renders the stage title, count, and empty state', () => {
    render(<KitchenColumn {...kitchenColumnMock} />)

    expect(
      screen.getByRole('region', { name: 'Aguardando preparo' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Nenhum pedido aguardando preparo.')
    ).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
