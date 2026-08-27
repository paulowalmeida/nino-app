import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'

import { KitchenBoard } from './KitchenBoard'

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
    render(<KitchenBoard />)
    expect(
      screen.getByRole('region', { name: 'Chegou agora' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'No balcão' })
    ).toBeInTheDocument()
    expect(screen.getAllByText(/Nada|Nenhum/).length).toBe(5)
  })
})
