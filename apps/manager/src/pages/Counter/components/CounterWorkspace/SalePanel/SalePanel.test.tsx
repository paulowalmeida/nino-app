import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SalePanel } from './SalePanel'

vi.mock('./SaleCart/SaleCart', () => ({ SaleCart: () => <div>cart</div> }))
vi.mock('./SalePaymentDetails/SalePaymentDetails', () => ({
  SalePaymentDetails: () => <div>payment</div>,
}))
vi.mock('./SaleFinishActions/SaleFinishActions', () => ({
  SaleFinishActions: () => <div>finish</div>,
}))
vi.mock('./SaleReceiptButton/SaleReceiptButton', () => ({
  SaleReceiptButton: () => <div>receipt</div>,
}))
const facadeState = vi.hoisted(() => ({
  lines: [],
  count: 1,
  total: 10,
  methods: ['CASH'],
  method: 'CASH' as string | null,
  step: 'payment' as const,
  channel: 'COUNTER' as const,
  customerName: '',
  tableNumber: '',
  error: null,
  isSending: false,
  handleStep: vi.fn(),
  setCustomerName: vi.fn(),
  setTableNumber: vi.fn(),
  setChannel: vi.fn(),
  setStep: vi.fn(),
  setChosen: vi.fn(),
  emptyTicket: vi.fn(),
  finish: vi.fn(),
  lastSale: null,
  dismissReceipt: vi.fn(),
}))
vi.mock('@pages/Counter/facades/useCounterFacade/useCounterFacade', () => ({
  useCounterFacade: () => facadeState,
}))

describe(SalePanel.name, () => {
  it('composes the standard sale panel', () => {
    render(<SalePanel />)
    expect(screen.getByText('Venda')).toBeInTheDocument()
    expect(screen.getByText('payment')).toBeInTheDocument()
    expect(screen.getByText('receipt')).toBeInTheDocument()
  })

  it('composes the bare sale panel without header or payment', () => {
    facadeState.count = 0
    facadeState.method = null
    render(<SalePanel bare />)
    expect(screen.queryByText('Venda')).not.toBeInTheDocument()
    expect(screen.queryByText('payment')).not.toBeInTheDocument()
  })
})
