import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'

import { NewOrder } from './NewOrder'
import { newOrderPageMock } from './NewOrder.mock'

vi.mock('@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade')
vi.mock('@pages/NewOrder/components/NewOrderMenu/NewOrderMenu', () => ({
  NewOrderMenu: () => <div>menu</div>,
}))
vi.mock('@pages/NewOrder/components/NewOrderTicket/NewOrderTicket', () => ({
  NewOrderTicket: () => <div>ticket</div>,
}))

const resetDraft = vi.fn()

const renderPage = () =>
  render(
    <MemoryRouter>
      <NewOrder />
    </MemoryRouter>
  )

describe('NewOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNewOrderFacade).mockReturnValue({
      resetDraft,
    } as unknown as ReturnType<typeof useNewOrderFacade>)
  })

  it('composes the menu beside the ticket', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: newOrderPageMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText('menu')).toBeInTheDocument()
    expect(screen.getByText('ticket')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: newOrderPageMock.backLabel })
    ).toBeInTheDocument()
  })

  it('opens with a clean ticket every time the screen mounts', () => {
    const first = renderPage()
    expect(resetDraft).toHaveBeenCalledOnce()
    first.unmount()

    renderPage()

    expect(resetDraft).toHaveBeenCalledTimes(2)
  })
})
