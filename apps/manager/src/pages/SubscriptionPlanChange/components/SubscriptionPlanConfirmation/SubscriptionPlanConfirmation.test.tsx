import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SubscriptionPlanConfirmation } from './SubscriptionPlanConfirmation'
import { subscriptionPlanConfirmationMock } from './SubscriptionPlanConfirmation.mock'

describe(SubscriptionPlanConfirmation.name, () => {
  it('requires confirmation before changing to the selected plan', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    render(
      <SubscriptionPlanConfirmation
        {...subscriptionPlanConfirmationMock}
        isSubscriptionActive
        isUpdating={false}
        isUpdateError={false}
        onBack={vi.fn()}
        onConfirm={onConfirm}
      />
    )

    expect(screen.getByText('Plano atual')).toBeInTheDocument()
    expect(screen.getByText('Novo plano')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Confirmar alteração' })
    )

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('keeps actions safe while the subscription is inactive', async () => {
    const onBack = vi.fn()
    render(
      <SubscriptionPlanConfirmation
        {...subscriptionPlanConfirmationMock}
        isSubscriptionActive={false}
        isUpdating={false}
        isUpdateError
        onBack={onBack}
        onConfirm={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Confirmar alteração' })
    ).toBeDisabled()
    await userEvent.click(
      screen.getByRole('button', { name: 'Voltar e revisar' })
    )

    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('describes an unlimited selected plan', () => {
    render(
      <SubscriptionPlanConfirmation
        {...subscriptionPlanConfirmationMock}
        nextPlan={{
          ...subscriptionPlanConfirmationMock.nextPlan,
          maxUnits: null,
        }}
        isSubscriptionActive
        isUpdating={false}
        isUpdateError={false}
        onBack={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.getByText(/Unidades ilimitadas/)).toBeInTheDocument()
  })
})
