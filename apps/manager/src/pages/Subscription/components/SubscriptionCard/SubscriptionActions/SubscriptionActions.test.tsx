import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SubscriptionActions } from './SubscriptionActions'
import { subscriptionActionsMock } from './SubscriptionActions.mock'

const renderActions = (
  onManagePlan = vi.fn(),
  onCancel = vi.fn().mockResolvedValue(undefined),
  subscription = subscriptionActionsMock.subscription
) =>
  render(
    <SubscriptionActions
      subscription={subscription}
      isUpdating={false}
      onManagePlan={onManagePlan}
      onCancel={onCancel}
    />
  )

describe(SubscriptionActions.name, () => {
  it('opens the plan change journey', async () => {
    const onManagePlan = vi.fn()
    renderActions(onManagePlan)

    await userEvent.click(screen.getByRole('button', { name: 'Alterar plano' }))

    expect(onManagePlan).toHaveBeenCalledTimes(1)
  })

  it('confirms cancellation and keeps the dialog open when it fails', async () => {
    const onCancel = vi.fn().mockRejectedValue(new Error('request failed'))
    renderActions(undefined, onCancel)

    await userEvent.click(
      screen.getByRole('button', { name: 'Cancelar assinatura' })
    )
    const dialog = screen.getByRole('dialog')
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'open'))
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancelar assinatura' })
    )

    await waitFor(() => expect(onCancel).toHaveBeenCalledTimes(1))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('blocks plan management while the subscription is inactive', () => {
    renderActions(undefined, undefined, {
      ...subscriptionActionsMock.subscription,
      isActive: false,
    })

    expect(screen.getByRole('button', { name: 'Alterar plano' })).toBeDisabled()
    expect(
      screen.getByText(
        'A troca de plano fica disponível quando a assinatura estiver ativa.'
      )
    ).toBeInTheDocument()
  })
})
