import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SubscriptionPlanChoice } from './SubscriptionPlanChoice'
import { subscriptionPlanChoiceMock } from './SubscriptionPlanChoice.mock'

describe(SubscriptionPlanChoice.name, () => {
  it('continues only after selecting a different direct plan', async () => {
    const onContinue = vi.fn()
    render(
      <SubscriptionPlanChoice
        currentPlan={subscriptionPlanChoiceMock.currentPlan}
        plans={subscriptionPlanChoiceMock.plans}
        isSubscriptionActive
        onContinue={onContinue}
        onRequestInterest={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled()
    await userEvent.click(screen.getByText('Padrão'))
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(onContinue).toHaveBeenCalledWith('plan-standard')
  })

  it('explains when no direct plan is available', () => {
    render(
      <SubscriptionPlanChoice
        currentPlan={subscriptionPlanChoiceMock.currentPlan}
        plans={[]}
        isSubscriptionActive={false}
        onContinue={vi.fn()}
        onRequestInterest={vi.fn()}
      />
    )

    expect(
      screen.getByText(
        'Não há planos de contratação direta disponíveis no momento.'
      )
    ).toBeInTheDocument()
  })

  it('describes an unlimited direct plan', () => {
    render(
      <SubscriptionPlanChoice
        currentPlan={subscriptionPlanChoiceMock.currentPlan}
        plans={[
          subscriptionPlanChoiceMock.currentPlan,
          {
            ...subscriptionPlanChoiceMock.currentPlan,
            id: 'plan-unlimited',
            name: 'Ilimitado',
            slug: 'ilimitado',
            maxUnits: null,
          },
        ]}
        isSubscriptionActive
        onContinue={vi.fn()}
        onRequestInterest={vi.fn()}
      />
    )

    expect(screen.getByText('Unidades ilimitadas')).toBeInTheDocument()
  })
})
