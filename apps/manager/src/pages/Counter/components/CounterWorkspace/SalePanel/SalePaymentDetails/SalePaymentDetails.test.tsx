import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SalePaymentDetails } from './SalePaymentDetails'
import { salePaymentDetailsMock } from './SalePaymentDetails.mock'

describe(SalePaymentDetails.name, () => {
  it('reports the chosen payment method', () => {
    // Arrange
    const onMethod = vi.fn()
    render(
      <SalePaymentDetails
        {...salePaymentDetailsMock}
        methods={['CASH', 'PIX']}
        onMethod={onMethod}
        changeFor=""
        changeAmount={0}
        hasChange={false}
        isChangeValid
        onChangeFor={vi.fn()}
      />
    )

    // Act
    fireEvent.click(screen.getByRole('button', { name: /PIX/i }))

    // Assert
    expect(onMethod).toHaveBeenCalledWith('PIX')
  })

  it('shows the change for cash payments', () => {
    render(
      <SalePaymentDetails
        {...salePaymentDetailsMock}
        onMethod={vi.fn()}
        changeFor="50,00"
        changeAmount={10}
        hasChange
        isChangeValid
        onChangeFor={vi.fn()}
      />
    )

    expect(screen.getByText('Troco')).toBeInTheDocument()
    expect(screen.getByText('R$ 10,00')).toBeInTheDocument()
  })

  it('states that an exact payment owes no change', () => {
    render(
      <SalePaymentDetails
        {...salePaymentDetailsMock}
        onMethod={vi.fn()}
        changeFor="24,90"
        changeAmount={0}
        hasChange={false}
        isChangeValid
        onChangeFor={vi.fn()}
      />
    )

    expect(screen.getByText('Sem troco')).toBeInTheDocument()
    expect(
      screen.queryByText('Informe um valor igual ou maior que o total.')
    ).not.toBeInTheDocument()
  })

  it('waits for an amount before showing the change', () => {
    // Arrange
    render(
      <SalePaymentDetails
        onMethod={vi.fn()}
        {...salePaymentDetailsMock}
        changeFor=""
        changeAmount={0}
        hasChange={false}
        isChangeValid
        onChangeFor={vi.fn()}
      />
    )

    // Assert
    expect(screen.queryByText('Troco')).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'Escolha quanto o cliente entregou e o troco aparece aqui.'
      )
    ).toBeInTheDocument()
  })

  it('masks the received amount while it is typed', async () => {
    // Arrange
    const onChangeFor = vi.fn()
    render(
      <SalePaymentDetails
        {...salePaymentDetailsMock}
        onMethod={vi.fn()}
        changeFor=""
        changeAmount={0}
        hasChange={false}
        isChangeValid
        onChangeFor={onChangeFor}
      />
    )

    // Act
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Valor recebido' }),
      '5'
    )

    // Assert
    expect(onChangeFor).toHaveBeenCalledWith('0,05')
  })

  it('warns when the amount received is below the total', () => {
    render(
      <SalePaymentDetails
        {...salePaymentDetailsMock}
        onMethod={vi.fn()}
        changeFor="20,00"
        changeAmount={0}
        hasChange
        isChangeValid={false}
        onChangeFor={vi.fn()}
      />
    )

    expect(
      screen.getByText('Informe um valor igual ou maior que o total.')
    ).toBeInTheDocument()
  })

  it('hides the cash fields for another payment method', () => {
    render(
      <SalePaymentDetails
        {...salePaymentDetailsMock}
        methods={['PIX']}
        method="PIX"
        onMethod={vi.fn()}
        changeFor=""
        changeAmount={0}
        hasChange={false}
        isChangeValid
        onChangeFor={vi.fn()}
      />
    )

    expect(screen.queryByText('Troco')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Valor exato' })
    ).not.toBeInTheDocument()
  })
})
