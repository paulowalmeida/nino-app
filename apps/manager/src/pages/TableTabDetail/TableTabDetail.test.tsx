import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import type { Order } from '@shared/types/order/order'

import { TableTabDetail } from './TableTabDetail'

vi.mock('@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade')
vi.mock(
  '@pages/TableTabDetail/components/TableTabDetailContent/TableTabDetailContent',
  () => ({
    TableTabDetailContent: () => <div>comanda detail</div>,
  })
)

describe(TableTabDetail.name, () => {
  it('renders the dedicated table tab screen', () => {
    vi.mocked(useTableTabDetailFacade).mockReturnValue({
      order: undefined as unknown as Order,
      isPending: false,
      isError: false,
      cancelItem: vi.fn(),
      isCancellingItem: false,
    })

    render(<TableTabDetail />)

    expect(screen.getByText('comanda detail')).toBeInTheDocument()
  })
})
