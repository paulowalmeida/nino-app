import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PaymentRules } from './PaymentRules'
import { paymentRulesSettingsMock } from './PaymentRules.mock'

describe(PaymentRules.name, () => {
  it('shows only the payment settings while loading', () => {
    render(
      <PaymentRules
        settings={undefined}
        isPending
        isSaving={false}
        onSave={vi.fn()}
      />
    )

    expect(screen.queryByText('Pagamento')).not.toBeInTheDocument()
  })

  it('updates payment settings and saves the full unit contract', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(
      <PaymentRules
        settings={paymentRulesSettingsMock}
        isPending={false}
        isSaving={false}
        onSave={onSave}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Cartão online' }))
    await user.click(
      screen.getByRole('checkbox', { name: 'Pedir CPF na nota' })
    )
    await user.clear(screen.getByRole('textbox', { name: 'Pedido mínimo' }))
    await user.type(
      screen.getByRole('textbox', { name: 'Pedido mínimo' }),
      '30,00'
    )
    await user.click(screen.getByRole('button', { name: 'Salvar pagamento' }))

    expect(onSave).toHaveBeenCalledWith({
      ...paymentRulesSettingsMock,
      requireCpf: true,
      minOrderAmount: 30,
      acceptedPaymentMethods: ['PIX', 'CARD_ONLINE'],
    })
  })
})
