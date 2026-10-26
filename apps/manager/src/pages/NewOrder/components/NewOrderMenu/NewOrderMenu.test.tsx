import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'

import { NewOrderMenu } from './NewOrderMenu'
import { menuSectionsMock } from './NewOrderMenu.mock'

vi.mock('@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade')
vi.mock(
  '@pages/NewOrder/skeletons/NewOrderMenuSkeleton/NewOrderMenuSkeleton',
  () => ({ NewOrderMenuSkeleton: () => <div>loading menu</div> })
)

const add = vi.fn()

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useNewOrderFacade).mockReturnValue({
    sections: menuSectionsMock,
    isMenuPending: false,
    draft: { add },
    ...overrides,
  } as unknown as ReturnType<typeof useNewOrderFacade>)

describe('NewOrderMenu', () => {
  beforeEach(() => vi.clearAllMocks())

  it('offers only the items that are on today', () => {
    facadeWith({})

    render(<NewOrderMenu />)

    expect(
      screen.getByRole('heading', { name: 'Salgados' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Adicionar Coxinha' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Adicionar Pastel desligado' })
    ).not.toBeInTheDocument()
  })

  it('puts the chosen item on the ticket', async () => {
    facadeWith({})

    render(<NewOrderMenu />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Adicionar Coxinha' })
    )

    expect(add).toHaveBeenCalledWith({
      productId: 'product-1',
      name: 'Coxinha',
      unitPrice: 7.5,
    })
  })

  it('shows the skeleton while the menu loads', () => {
    facadeWith({ isMenuPending: true, sections: [] })

    render(<NewOrderMenu />)

    expect(screen.getByText('loading menu')).toBeInTheDocument()
  })

  it('asks for a registered item when the menu is empty', () => {
    facadeWith({ sections: [] })

    render(<NewOrderMenu />)

    expect(screen.getByText(/O cardápio está vazio/)).toBeInTheDocument()
  })
})
