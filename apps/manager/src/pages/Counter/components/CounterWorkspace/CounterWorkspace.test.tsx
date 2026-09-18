import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CounterWorkspace } from './CounterWorkspace'
const counter = vi.hoisted(() => ({
  sections: [],
  isPending: false,
  lines: [],
  count: 1,
  total: 10,
  methods: ['CASH'],
  method: 'CASH',
  consumerName: '',
  tableNumber: '',
  isDesktop: false,
  sheet: false,
  step: 'items',
  setStep: vi.fn(),
  error: null,
  isSending: false,
  add: vi.fn(),
  setSheet: vi.fn(),
  setChosen: vi.fn(),
  setConsumerName: vi.fn(),
  setTableNumber: vi.fn(),
  handleStep: vi.fn(),
  emptyTicket: vi.fn(),
  finish: vi.fn(),
  lastSale: null,
  isDownloadingReceipt: false,
  downloadReceipt: vi.fn(),
  dismissReceipt: vi.fn(),
}))

vi.mock('@pages/Counter/facades/useCounterFacade/useCounterFacade', () => ({
  useCounterFacade: vi.fn(),
}))
vi.mock('./ProductGrid/ProductGrid', () => ({
  ProductGrid: () => <div>products</div>,
}))
vi.mock('./OpenOrderBar/OpenOrderBar', () => ({
  OpenOrderBar: () => (
    <button onClick={() => counter.setSheet(true)}>coupon</button>
  ),
}))
vi.mock('./SalePanel/SalePanel', () => ({
  SalePanel: () => <button onClick={counter.handleStep}>sale</button>,
}))
vi.mock('./SalePanel/SaleReceiptButton/SaleReceiptButton', () => ({
  SaleReceiptButton: ({
    saleReceipt,
    onDismiss,
  }: {
    saleReceipt: { orderNumber: number } | null
    onDismiss: () => void
  }) =>
    saleReceipt ? (
      <button onClick={onDismiss}>receipt #{saleReceipt.orderNumber}</button>
    ) : null,
}))
vi.mock('@nino/ds/components/Modal', () => ({
  Modal: ({
    open,
    body,
    onOpenChange,
  }: {
    open: boolean
    body: React.ReactNode
    onOpenChange: (open: boolean) => void
  }) =>
    open ? (
      <div>
        <button onClick={() => onOpenChange(false)}>modal-close</button>
        {body}
      </div>
    ) : null,
}))

import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'

type CounterFacade = ReturnType<typeof useCounterFacade>

const mockFacade = (overrides: Record<string, unknown> = {}) =>
  vi.mocked(useCounterFacade).mockReturnValue({
    ...counter,
    ...overrides,
  } as unknown as CounterFacade)

describe(CounterWorkspace.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens the sale from the coupon on mobile', () => {
    mockFacade()
    render(<CounterWorkspace />)
    expect(screen.getByText('products')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'coupon' }))
    expect(counter.setSheet).toHaveBeenCalledWith(true)
  })

  it('closes the mobile sale from any step', () => {
    // Arrange
    mockFacade({ sheet: true, step: 'payment' })
    render(<CounterWorkspace />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'modal-close' }))

    // Assert
    expect(
      screen.getAllByRole('button', { name: 'sale' }).length
    ).toBeGreaterThan(0)
    expect(counter.setSheet).toHaveBeenCalledWith(false)
  })

  it('disables the back button on the first step', () => {
    mockFacade({ sheet: true, step: 'items' })
    render(<CounterWorkspace />)
    expect(
      screen.getByRole('button', { name: 'Voltar um passo' })
    ).toBeDisabled()
  })

  it('keeps a single checkout mounted across screen sizes', () => {
    mockFacade({ sheet: true, step: 'items', isDesktop: false })
    const { rerender } = render(<CounterWorkspace />)
    const sale = screen.getByRole('button', { name: 'sale' })
    mockFacade({ sheet: true, step: 'items', isDesktop: true })
    rerender(<CounterWorkspace />)
    expect(screen.getByRole('button', { name: 'sale' })).toBe(sale)
    expect(
      screen.getByRole('button', { name: 'Voltar um passo' })
    ).toBeDisabled()
  })

  it('enables the back button past the first step', () => {
    mockFacade({ sheet: true, step: 'payment' })
    render(<CounterWorkspace />)
    expect(
      screen.getByRole('button', { name: 'Voltar um passo' })
    ).toBeEnabled()
  })

  it('renders the desktop sale without coupon', () => {
    mockFacade({ count: 2, isDesktop: true, sheet: true })
    render(<CounterWorkspace />)
    expect(
      screen.getAllByRole('button', { name: 'sale' }).length
    ).toBeGreaterThan(0)
    expect(screen.getByText('coupon')).toBeInTheDocument()
  })

  it('does not render the coupon for an empty mobile workspace', () => {
    mockFacade({ count: 0, sheet: true, isDesktop: false })
    render(<CounterWorkspace />)
    expect(
      screen.queryByRole('button', { name: 'coupon' })
    ).not.toBeInTheDocument()
  })

  it('keeps the closed-sale receipt visible after the sheet closes', () => {
    // Arrange: finishing a sale clears the ticket (count 0) and closes the
    // sheet in the same update, which used to unmount the receipt with it.
    mockFacade({
      count: 0,
      sheet: false,
      lastSale: { orderNumber: 128 },
    })

    // Act
    render(<CounterWorkspace />)

    // Assert
    expect(
      screen.getByRole('button', { name: 'receipt #128' })
    ).toBeInTheDocument()
  })
})
