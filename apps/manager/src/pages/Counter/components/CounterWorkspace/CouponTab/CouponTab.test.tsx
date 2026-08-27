import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CouponTab } from './CouponTab'
const facadeState = vi.hoisted(() => ({
  count: 2,
  total: 25,
  setSheet: vi.fn(),
}))
vi.mock('@pages/Counter/facades/useCounterFacade/useCounterFacade', () => ({
  useCounterFacade: () => facadeState,
}))

describe(CouponTab.name, () => {
  it('shows count and total and opens the sale', () => {
    render(<CouponTab />)
    expect(screen.getByText('2 itens')).toBeInTheDocument()
    expect(screen.getByText('R$ 25,00')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(facadeState.setSheet).toHaveBeenCalledWith(true)
  })

  it('uses singular copy for one item', () => {
    facadeState.count = 1
    render(<CouponTab />)
    expect(screen.getByText('1 item')).toBeInTheDocument()
  })
})
