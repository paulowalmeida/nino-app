import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { TabBill } from './TabBill'
import { tabBillMock } from './TabBill.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)

const mockFacade = (overrides: Record<string, unknown>) => {
  const submitServiceFee = vi.fn()
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    tab: tabBillMock.feeTab,
    storeServiceFeePercent: 10,
    submitServiceFee,
    isSettingServiceFee: false,
    ...overrides,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)
  return submitServiceFee
}

describe('TabBill', () => {
  beforeEach(() => vi.clearAllMocks())

  it('adds the service fee to the consumption and shows what is left', () => {
    mockFacade({})

    render(<TabBill />)

    expect(screen.getByText('R$ 36,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 3,60')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 39,60')).toHaveLength(2)
    expect(screen.getByText('Falta pagar')).toBeInTheDocument()
  })

  it('takes the fee off when the customer declines it', async () => {
    const submitServiceFee = mockFacade({})

    render(<TabBill />)
    await userEvent.click(screen.getByRole('checkbox'))

    expect(submitServiceFee).toHaveBeenCalledWith({ applied: false })
  })

  it('lets the fee come back after it was declined', async () => {
    const submitServiceFee = mockFacade({ tab: tabBillMock.declinedFeeTab })

    render(<TabBill />)

    expect(screen.getByText(tabBillMock.serviceFeeLabel)).toBeInTheDocument()
    expect(screen.getByText('Recusado')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('checkbox'))
    expect(submitServiceFee).toHaveBeenCalledWith({ applied: true })
  })

  it('freezes the fee once part of the bill is paid', () => {
    mockFacade({ tab: tabBillMock.partlyPaidFeeTab })

    render(<TabBill />)

    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(screen.getByText('R$ 19,60')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Com pagamento registrado, a taxa de serviço não muda mais.'
      )
    ).toBeInTheDocument()
  })

  it('hides the fee line when the store does not charge it', () => {
    mockFacade({ tab: tabBillMock.declinedFeeTab, storeServiceFeePercent: 0 })

    render(<TabBill />)

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('renders nothing while the tab is unknown', () => {
    mockFacade({ tab: undefined })

    const { container } = render(<TabBill />)

    expect(container).toBeEmptyDOMElement()
  })
})
