import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { TabPaymentForm } from './TabPaymentForm'
import { tabPaymentFormMock } from './TabPaymentForm.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)

const mockFacade = (overrides: Record<string, unknown> = {}) => {
  const submitPay = vi.fn()
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    tab: tabPaymentFormMock.tab,
    submitPay,
    isPaying: false,
    ...overrides,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)
  return submitPay
}

const confirmButton = () =>
  screen.getByRole('button', { name: 'Registrar pagamento' })

describe('TabPaymentForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('offers to register the payment only after a method is chosen', async () => {
    mockFacade()
    render(<TabPaymentForm />)

    expect(
      screen.queryByRole('button', { name: 'Registrar pagamento' })
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.pixLabel))

    expect(confirmButton()).toBeEnabled()
  })

  it('registers a payment that gives no change with just the method', async () => {
    const submitPay = mockFacade()
    render(<TabPaymentForm />)

    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.pixLabel))
    await userEvent.click(confirmButton())

    expect(submitPay).toHaveBeenCalledWith({ method: 'PIX' })
    expect(
      screen.queryByRole('textbox', { name: tabPaymentFormMock.receivedLabel })
    ).not.toBeInTheDocument()
  })

  it('asks for the received amount on cash and shows the change', async () => {
    const submitPay = mockFacade()
    render(<TabPaymentForm />)

    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.cashLabel))
    await userEvent.type(
      screen.getByRole('textbox', { name: tabPaymentFormMock.receivedLabel }),
      '5000'
    )

    expect(screen.getByText('Troco')).toBeInTheDocument()
    expect(screen.getByText('R$ 14,00')).toBeInTheDocument()

    await userEvent.click(confirmButton())

    expect(submitPay).toHaveBeenCalledWith({
      method: 'CASH',
      amountReceived: 50,
    })
  })

  it('accepts cash without an amount as the exact total', async () => {
    const submitPay = mockFacade()
    render(<TabPaymentForm />)

    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.cashLabel))
    await userEvent.click(confirmButton())

    expect(submitPay).toHaveBeenCalledWith({ method: 'CASH' })
    expect(screen.queryByText('Troco')).not.toBeInTheDocument()
  })

  it('blocks cash received below the total of the tab', async () => {
    const submitPay = mockFacade()
    render(<TabPaymentForm />)

    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.cashLabel))
    await userEvent.type(
      screen.getByRole('textbox', { name: tabPaymentFormMock.receivedLabel }),
      '1000'
    )

    expect(screen.getByText('Menor que o total da conta.')).toBeInTheDocument()
    expect(confirmButton()).toBeDisabled()
    expect(submitPay).not.toHaveBeenCalled()
  })

  it('shows the loading state while the payment is registered', async () => {
    mockFacade({ isPaying: true })
    render(<TabPaymentForm />)
    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.pixLabel))

    expect(screen.getByRole('button', { name: /Carregando/ })).toHaveAttribute(
      'aria-busy',
      'true'
    )
  })

  it('renders nothing while the tab is unknown', () => {
    mockFacade({ tab: undefined })

    const { container } = render(<TabPaymentForm />)

    expect(container).toBeEmptyDOMElement()
  })
})
