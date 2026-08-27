import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CounterWorkspace } from './CounterWorkspace'
const counter = vi.hoisted(() => ({
  sections: [],
  isPending: false,
  lines: [],
  count: 1,
  total: 10,
  methods: ['CASH'],
  method: 'CASH',
  customerName: '',
  tableNumber: '',
  isDesktop: false,
  sheet: false,
  error: null,
  isSending: false,
  add: vi.fn(),
  setSheet: vi.fn(),
  setChosen: vi.fn(),
  setCustomerName: vi.fn(),
  setTableNumber: vi.fn(),
  handleStep: vi.fn(),
  emptyTicket: vi.fn(),
  finish: vi.fn(),
}))

vi.mock('@pages/Counter/facades/useCounterFacade/useCounterFacade', () => ({
  useCounterFacade: vi.fn(),
}))
vi.mock('./ProductGrid/ProductGrid', () => ({
  ProductGrid: () => <div>products</div>,
}))
vi.mock('./CouponTab/CouponTab', () => ({
  CouponTab: () => (
    <button onClick={() => counter.setSheet(true)}>coupon</button>
  ),
}))
vi.mock('./SalePanel/SalePanel', () => ({
  SalePanel: () => <button onClick={counter.handleStep}>sale</button>,
}))
vi.mock('@nino/ds/components/Drawer', () => ({
  Drawer: ({
    children,
    onOpenChange,
  }: {
    children: React.ReactNode
    onOpenChange: (open: boolean) => void
  }) => (
    <div>
      <button onClick={() => onOpenChange(false)}>drawer-close</button>
      {children}
    </div>
  ),
}))

import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'

describe(CounterWorkspace.name, () => {
  it('renders mobile coupon and sale drawer', () => {
    vi.mocked(useCounterFacade).mockReturnValue(counter as never)
    render(<CounterWorkspace />)
    expect(screen.getByText('products')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'coupon' }))
    expect(counter.setSheet).toHaveBeenCalledWith(true)
    expect(
      screen.getAllByRole('button', { name: 'sale' }).length
    ).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'drawer-close' }))
  })

  it('renders the desktop sale without coupon', () => {
    vi.mocked(useCounterFacade).mockReturnValue({
      ...counter,
      count: 2,
      isDesktop: true,
    } as never)
    render(<CounterWorkspace />)
    expect(
      screen.getAllByRole('button', { name: 'sale' }).length
    ).toBeGreaterThan(0)
    expect(screen.queryByText('coupon')).not.toBeInTheDocument()
  })

  it('does not render the coupon for an empty mobile workspace', () => {
    vi.mocked(useCounterFacade).mockReturnValue({
      ...counter,
      count: 0,
      sheet: true,
      isDesktop: false,
    } as never)
    render(<CounterWorkspace />)
    expect(
      screen.queryByRole('button', { name: 'coupon' })
    ).not.toBeInTheDocument()
  })
})
