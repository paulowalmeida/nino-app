import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TableTabDetail } from './TableTabDetail'

vi.mock('@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade', () => ({
  useTableTabsFacade: () => ({
    openOrders: [],
    closedOrders: [],
    order: undefined,
    isPending: false,
    isError: false,
  }),
}))
vi.mock(
  '@pages/TableTabDetail/components/TableTabDetailContent/TableTabDetailContent',
  () => ({
    TableTabDetailContent: () => <div>comanda detail</div>,
  })
)

describe(TableTabDetail.name, () => {
  it('renders the dedicated table tab screen', () => {
    render(<TableTabDetail />)

    expect(screen.getByText('comanda detail')).toBeInTheDocument()
  })
})
