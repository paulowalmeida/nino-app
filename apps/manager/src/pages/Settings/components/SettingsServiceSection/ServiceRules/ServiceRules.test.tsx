import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ServiceRules } from './ServiceRules'
import { serviceRulesSettingsMock } from './ServiceRules.mock'

describe('ServiceRules', () => {
  it('renders its loading state', () => {
    render(
      <ServiceRules
        settings={undefined}
        isPending
        isSaving={false}
        onSave={() => undefined}
      />
    )
    expect(document.body).toBeTruthy()
  })

  it('keeps payment settings out of the service page', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(
      <ServiceRules
        settings={serviceRulesSettingsMock}
        isPending={false}
        isSaving={false}
        onSave={onSave}
      />
    )

    expect(
      screen.queryByText('Formas de pagamento aceitas')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Pedir CPF na nota')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', { name: 'Pedido mínimo' })
    ).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('checkbox', { name: 'Pedido sem cadastro' })
    )
    await user.click(screen.getByRole('button', { name: 'Salvar atendimento' }))

    expect(onSave).toHaveBeenCalledWith({
      ...serviceRulesSettingsMock,
      allowGuestOrder: false,
    })
  })
})
