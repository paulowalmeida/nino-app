import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'

import { Kitchen } from './Kitchen'
import { kitchenPageMock } from './Kitchen.mock'

vi.mock('@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade')
vi.mock('./components/KitchenBoard/KitchenBoard', () => ({
  KitchenBoard: ({ isCompact }: { isCompact: boolean }) => (
    <div>{isCompact ? 'compact board' : 'kitchen board'}</div>
  ),
}))

const facadeReturning = (isError: boolean) =>
  vi.mocked(useKitchenFacade).mockReturnValue({
    orders: [],
    isPending: false,
    isError,
    isAdvancing: false,
  } as never)

describe(Kitchen.name, () => {
  it('composes the header and the board inside the screen', () => {
    facadeReturning(false)

    render(<Kitchen />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Cozinha' })
    ).toBeInTheDocument()
    expect(screen.getByText('kitchen board')).toBeInTheDocument()
  })

  it('compacts the tickets when the density is switched', async () => {
    facadeReturning(false)
    const user = userEvent.setup()

    render(<Kitchen />)

    await user.click(
      screen.getByRole('button', { name: kitchenPageMock.compactLabel })
    )

    expect(screen.getByText('compact board')).toBeInTheDocument()
  })

  it('explains what to do when the orders fail to load', () => {
    facadeReturning(true)

    render(<Kitchen />)

    expect(screen.getByText(/Recarregue a página/)).toBeInTheDocument()
    expect(screen.queryByText('kitchen board')).not.toBeInTheDocument()
  })
})
