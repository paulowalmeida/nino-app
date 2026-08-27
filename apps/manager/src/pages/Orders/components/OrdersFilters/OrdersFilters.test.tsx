import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOrdersFacade } from '@pages/Orders/facades/useOrdersFacade/useOrdersFacade'

import { OrdersFilters } from './OrdersFilters'
import { ordersFiltersMock } from './OrdersFilters.mock'

vi.mock('@pages/Orders/facades/useOrdersFacade/useOrdersFacade')
vi.mock('@pages/Orders/components/StageTrack/StageTrack', () => ({
  StageTrack: () => <div>stage track</div>,
}))

describe('OrdersFilters', () => {
  it('renders search and stage controls through the facade', () => {
    const setTerm = vi.fn()
    vi.mocked(useOrdersFacade).mockReturnValue({
      summary: undefined,
      isSearching: false,
      search: '',
      stage: 'incoming',
      term: '',
      setStage: vi.fn(),
      setTerm,
    } as never)

    render(<OrdersFilters />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(ordersFiltersMock.searchLabel)).toBeInTheDocument()
    expect(screen.getByText('stage track')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(ordersFiltersMock.searchLabel), {
      target: { value: 'novo' },
    })
    expect(setTerm).toHaveBeenCalledWith('novo')
  })

  it('renders the live search result controls', () => {
    const setTerm = vi.fn()
    vi.mocked(useOrdersFacade).mockReturnValue({
      summary: undefined,
      isSearching: true,
      search: 'pastel',
      stage: 'incoming',
      term: 'pastel',
      setStage: vi.fn(),
      setTerm,
    } as never)

    render(<OrdersFilters />, { wrapper: MemoryRouter })

    expect(screen.getByText(/pastel/)).toBeInTheDocument()
    screen.getByRole('button', { name: 'Limpar busca' }).click()
    expect(setTerm).toHaveBeenCalledWith('')
  })

  it('uses the singular result label', () => {
    vi.mocked(useOrdersFacade).mockReturnValue({
      summary: undefined,
      isSearching: true,
      search: 'a',
      stage: 'incoming',
      term: 'a',
      setStage: vi.fn(),
      setTerm: vi.fn(),
    } as never)

    render(<OrdersFilters />, { wrapper: MemoryRouter })

    expect(screen.getByText(/1 pedido para/)).toBeInTheDocument()
  })
})
