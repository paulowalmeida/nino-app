import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SalePaymentDetails } from './SalePaymentDetails'
import { salePaymentDetailsMock } from './SalePaymentDetails.mock'

describe(SalePaymentDetails.name, () => {
  it('updates recipient fields and payment method', () => {
    const onCustomerName = vi.fn()
    const onMethod = vi.fn()
    render(
      <SalePaymentDetails
        {...salePaymentDetailsMock}
        methods={['CASH', 'PIX']}
        customerName=""
        onCustomerName={onCustomerName}
        onMethod={onMethod}
        changeFor=""
        changeAmount={0}
        isChangeValid={false}
        onChangeFor={vi.fn()}
      />
    )
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Nome de quem pediu' }),
      { target: { value: 'Ana' } }
    )
    fireEvent.click(screen.getByRole('button', { name: /PIX/i }))
    expect(onCustomerName).toHaveBeenCalledWith('Ana')
    expect(onMethod).toHaveBeenCalledWith('PIX')
  })

  it('shows the change for cash payments', () => {
    const onChangeFor = vi.fn()

    render(
      <SalePaymentDetails
        {...salePaymentDetailsMock}
        customerName=""
        onCustomerName={vi.fn()}
        onMethod={vi.fn()}
        changeFor="50.00"
        changeAmount={10}
        isChangeValid
        onChangeFor={onChangeFor}
      />
    )

    fireEvent.change(
      screen.getByRole('spinbutton', { name: 'Valor recebido' }),
      {
      target: { value: '60.00' },
      }
    )

    expect(screen.getByText('Troco')).toBeInTheDocument()
    expect(screen.getByText('R$ 10,00')).toBeInTheDocument()
    expect(onChangeFor).toHaveBeenCalledWith('60.00')
  })
})
