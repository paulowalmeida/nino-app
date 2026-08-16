import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ServiceRules } from '@organisms/ServiceRules/ServiceRules'

import { baseSettings, settingsWithHigherMinOrder } from './ServiceRules.mock'

describe(ServiceRules.name, () => {
  it('shows a skeleton while settings are pending', () => {
    // Arrange / Act
    render(
      <ServiceRules
        settings={undefined}
        isPending
        isSaving={false}
        onSave={vi.fn()}
      />
    )

    // Assert
    expect(screen.queryByText('Como a loja atende')).not.toBeInTheDocument()
  })

  it('seeds the form with the received settings', () => {
    // Arrange / Act
    render(
      <ServiceRules
        settings={settingsWithHigherMinOrder}
        isPending={false}
        isSaving={false}
        onSave={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByLabelText('Pedido mínimo')).toHaveValue('35,00')
  })

  it('keeps save disabled until a field changes', () => {
    // Arrange / Act
    render(
      <ServiceRules
        settings={baseSettings}
        isPending={false}
        isSaving={false}
        onSave={vi.fn()}
      />
    )

    // Assert
    expect(
      screen.getByRole('button', { name: 'Salvar atendimento' })
    ).toBeDisabled()
  })

  it('sends the edited draft when saving', async () => {
    // Arrange
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(
      <ServiceRules
        settings={baseSettings}
        isPending={false}
        isSaving={false}
        onSave={onSave}
      />
    )

    // Act
    await user.click(screen.getByLabelText('Retirada'))
    await user.click(
      screen.getByRole('button', { name: 'Salvar atendimento' })
    )

    // Assert
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ isPickupEnabled: true })
    )
  })
})
