import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SubscriptionCard } from './SubscriptionCard'
import { activeSubscription } from './SubscriptionCard.mock'

describe(SubscriptionCard.name, () => {
  it('shows the plan summary and subscription facts', () => {
    render(<SubscriptionCard subscription={activeSubscription} />)

    expect(screen.getByText('Plano atual')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('R$ 99,00')).toBeInTheDocument()
    expect(screen.getByText('Ativa')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(
      screen.getByText(/de (dezembro de 2025|janeiro de 2026)/)
    ).toBeInTheDocument()
  })

  it('shows fallback values for an unlimited inactive subscription', () => {
    const subscription = {
      ...activeSubscription,
      isActive: false,
      plan: { ...activeSubscription.plan, maxUnits: null },
      subscriptionStatus: { id: 'status-2', name: 'Suspensa' },
    }

    render(<SubscriptionCard subscription={subscription} />)

    expect(screen.getByText('Suspensa')).toBeInTheDocument()
    expect(screen.getByText('ilimitadas')).toBeInTheDocument()
    expect(screen.getAllByText('—')).toHaveLength(2)
  })
})
