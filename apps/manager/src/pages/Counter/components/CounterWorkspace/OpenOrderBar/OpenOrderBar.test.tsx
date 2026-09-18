import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OpenOrderBar } from './OpenOrderBar'
const facadeState = vi.hoisted(() => ({
  count: 2,
  total: 25,
  setSheet: vi.fn(),
}))
const navigate = vi.hoisted(() => vi.fn())
vi.mock('@pages/Counter/facades/useCounterFacade/useCounterFacade', () => ({
  useCounterFacade: () => facadeState,
}))
vi.mock('react-router', () => ({
  useNavigate: () => navigate,
}))

describe(OpenOrderBar.name, () => {
  it('shows count and total and opens the sale', () => {
    render(<OpenOrderBar />)
    expect(screen.getByText('2 itens')).toBeInTheDocument()
    expect(screen.getByText('R$ 25,00')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(facadeState.setSheet).toHaveBeenCalledWith(true)
    expect(navigate).toHaveBeenCalledWith('fechar')
  })

  it('uses singular copy for one item', () => {
    facadeState.count = 1
    render(<OpenOrderBar />)
    expect(screen.getByText('1 item')).toBeInTheDocument()
  })
})
