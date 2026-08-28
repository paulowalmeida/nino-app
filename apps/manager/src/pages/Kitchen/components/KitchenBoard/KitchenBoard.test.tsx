import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'

import { KitchenBoard } from './KitchenBoard'
import { kitchenBoardMock } from './KitchenBoard.mock'

vi.mock('@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade')
vi.mock('@shared/components/KitchenCard/KitchenCard', () => ({
  KitchenCard: () => <article>order card</article>,
}))
vi.mock(
  '@pages/Kitchen/skeletons/KitchenCardSkeleton/KitchenCardSkeleton',
  () => ({ KitchenCardSkeleton: () => <article>loading card</article> })
)

describe(KitchenBoard.name, () => {
  it('presents all workflow columns and empty states', () => {
    vi.mocked(useKitchenFacade).mockReturnValue({
      orders: [],
      isPending: false,
      isAdvancing: false,
    } as never)
    render(<KitchenBoard isCompact={false} />)
    expect(
      screen.getByRole('region', { name: kitchenBoardMock.waitingColumn })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: kitchenBoardMock.preparingColumn })
    ).toBeInTheDocument()
    expect(screen.getAllByText(/Nada|Nenhum/).length).toBe(
      kitchenBoardMock.columnCount
    )
  })
})
