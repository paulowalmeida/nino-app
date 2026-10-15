import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SubscriptionActions } from './SubscriptionActions'
import { subscriptionActionsMock } from './SubscriptionActions.mock'

const renderActions = (
  onChangePlan = vi.fn().mockResolvedValue(undefined),
  onCancel = vi.fn().mockResolvedValue(undefined),
  subscription = subscriptionActionsMock.subscription,
  onRequestInterest = vi.fn()
) =>
  render(
    <SubscriptionActions
      subscription={subscription}
      plans={subscriptionActionsMock.plans}
      isUpdating={false}
      onChangePlan={onChangePlan}
      onCancel={onCancel}
      onRequestInterest={onRequestInterest}
    />
  )

describe(SubscriptionActions.name, () => {
  it('marks the current plan and opens a confirmation before switching', async () => {
    const onChangePlan = vi.fn().mockResolvedValue(undefined)
    renderActions(onChangePlan)

    expect(
      screen.getByRole('button', { name: 'Plano atual: Pro' })
    ).toBeDisabled()
    expect(
      screen.queryByRole('button', { name: /Rede/ })
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'Contratação personalizada para operações com mais unidades e necessidades específicas.'
      )
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Trocar para o plano Padrão' })
    )

    expect(screen.getByRole('dialog')).toHaveTextContent('R$ 199,00/mês')
    await userEvent.click(screen.getByRole('button', { name: 'Trocar plano' }))

    await waitFor(() =>
      expect(onChangePlan).toHaveBeenCalledWith('plan-default')
    )
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'closed')
    )
  })

  it('closes the plan confirmation without changing the plan', async () => {
    const onChangePlan = vi.fn().mockResolvedValue(undefined)
    renderActions(onChangePlan)

    await userEvent.click(
      screen.getByRole('button', { name: 'Trocar para o plano Padrão' })
    )
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    expect(onChangePlan).not.toHaveBeenCalled()
  })

  it('dismisses the confirmation with Escape', async () => {
    // Arrange
    const onChangePlan = vi.fn().mockResolvedValue(undefined)
    renderActions(onChangePlan)
    await userEvent.click(
      screen.getByRole('button', { name: 'Trocar para o plano Padrão' })
    )

    // Act
    await userEvent.keyboard('{Escape}')

    // Assert
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    expect(onChangePlan).not.toHaveBeenCalled()
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

  it('blocks plan changes while the subscription is inactive', () => {
    renderActions(undefined, undefined, {
      ...subscriptionActionsMock.subscription,
      isActive: false,
    })

    expect(
      screen.getByRole('button', { name: 'Trocar para o plano Padrão' })
    ).toBeDisabled()
    expect(
      screen.getByText(
        'A troca de plano fica disponível quando a assinatura estiver ativa.'
      )
    ).toBeInTheDocument()
  })

  it('opens the consultative request flow for Rede', async () => {
    const onRequestInterest = vi.fn()
    renderActions(undefined, undefined, undefined, onRequestInterest)

    await userEvent.click(
      screen.getByRole('button', { name: 'Solicitar proposta' })
    )

    expect(onRequestInterest).toHaveBeenCalledTimes(1)
  })
})
