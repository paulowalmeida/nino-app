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

const amountField = () =>
  screen.getByRole('textbox', { name: tabPaymentFormMock.amountLabel })

describe('TabPaymentForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('starts with what is left and asks for the method before registering', async () => {
    mockFacade()
    render(<TabPaymentForm />)

    expect(amountField()).toHaveValue('36,00')
    expect(
      screen.queryByRole('button', { name: /Registrar/ })
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.pixLabel))

    expect(
      screen.getByRole('button', { name: /Registrar R\$\s36,00/ })
    ).toBeEnabled()
  })

  it('splits what is left with a shortcut and registers that part', async () => {
    const submitPay = mockFacade()
    render(<TabPaymentForm />)

    await userEvent.click(
      screen.getByRole('button', { name: tabPaymentFormMock.halfSplitName })
    )
    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.pixLabel))
    await userEvent.click(
      screen.getByRole('button', { name: /Registrar R\$\s18,00/ })
    )

    expect(amountField()).toHaveValue('18,00')
    expect(submitPay).toHaveBeenCalledWith(
      { method: 'PIX', amount: 18 },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('refuses an amount above what is left', async () => {
    const submitPay = mockFacade()
    render(<TabPaymentForm />)

    await userEvent.clear(amountField())
    await userEvent.type(amountField(), '4000')
    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.pixLabel))

    expect(screen.getByText('Passa do que falta pagar.')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Registrar R\$\s40,00/ })
    ).toBeDisabled()
    expect(submitPay).not.toHaveBeenCalled()
  })

  it('asks for the received cash and shows the change of this part', async () => {
    const submitPay = mockFacade()
    render(<TabPaymentForm />)

    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.cashLabel))
    await userEvent.type(
      screen.getByRole('textbox', { name: tabPaymentFormMock.receivedLabel }),
      '5000'
    )

    expect(screen.getByText('Troco')).toBeInTheDocument()
    expect(screen.getByText('R$ 14,00')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: /Registrar R\$\s36,00/ })
    )

    expect(submitPay).toHaveBeenCalledWith(
      { method: 'CASH', amount: 36, amountReceived: 50 },
      expect.anything()
    )
  })

  it('blocks cash received below the amount being paid', async () => {
    mockFacade()
    render(<TabPaymentForm />)

    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.cashLabel))
    await userEvent.type(
      screen.getByRole('textbox', { name: tabPaymentFormMock.receivedLabel }),
      '1000'
    )

    expect(screen.getByText('Menor que o valor a pagar.')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Registrar R\$\s36,00/ })
    ).toBeDisabled()
  })

  it('clears the form after the payment is registered', async () => {
    const submitPay = mockFacade()
    submitPay.mockImplementation(
      (_request: unknown, options: { onSuccess: () => void }) =>
        options.onSuccess()
    )
    render(<TabPaymentForm />)

    await userEvent.click(
      screen.getByRole('button', { name: tabPaymentFormMock.halfSplitName })
    )
    await userEvent.click(screen.getByLabelText(tabPaymentFormMock.pixLabel))
    await userEvent.click(
      screen.getByRole('button', { name: /Registrar R\$\s18,00/ })
    )

    expect(amountField()).toHaveValue('36,00')
    expect(
      screen.queryByRole('button', { name: /Registrar/ })
    ).not.toBeInTheDocument()
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
