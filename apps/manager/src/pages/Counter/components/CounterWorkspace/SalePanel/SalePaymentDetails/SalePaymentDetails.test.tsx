import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SalePaymentDetails } from './SalePaymentDetails'
import { salePaymentDetailsMock } from './SalePaymentDetails.mock'

describe(SalePaymentDetails.name, () => {
  it('updates recipient fields and payment method', () => {
    const onCustomerName = vi.fn()
    const onTableNumber = vi.fn()
    const onMethod = vi.fn()
    render(
      <SalePaymentDetails
        {...salePaymentDetailsMock}
        methods={['CASH', 'PIX']}
        customerName=""
        tableNumber=""
        onCustomerName={onCustomerName}
        onTableNumber={onTableNumber}
        onMethod={onMethod}
      />
    )
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Nome de quem pediu' }),
      { target: { value: 'Ana' } }
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Mesa ou comanda' }), {
      target: { value: '4' },
    })
    fireEvent.click(screen.getByRole('button', { name: /PIX/i }))
    expect(onCustomerName).toHaveBeenCalledWith('Ana')
    expect(onTableNumber).toHaveBeenCalledWith('4')
    expect(onMethod).toHaveBeenCalledWith('PIX')
  })
})
