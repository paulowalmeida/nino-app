import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { activeSubscription } from '../SubscriptionCard.mock'
import { SubscriptionPlanSummary } from './SubscriptionPlanSummary'

describe(SubscriptionPlanSummary.name, () => {
  it('renders the current plan and monthly price', () => {
    render(<SubscriptionPlanSummary plan={activeSubscription.plan} />)

    expect(screen.getByText('Plano atual')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('R$ 99,00')).toBeInTheDocument()
  })

  it('shows consultative plans without a monthly price', () => {
    render(
      <SubscriptionPlanSummary
        plan={{ ...activeSubscription.plan, slug: 'rede', name: 'Rede' }}
      />
    )

    expect(screen.getByText('Sob consulta')).toBeInTheDocument()
    expect(screen.queryByText('/mês')).not.toBeInTheDocument()
  })
})
