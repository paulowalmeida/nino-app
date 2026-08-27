import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { activeSubscription } from '../SubscriptionCard.mock'
import { SubscriptionFacts } from './SubscriptionFacts'

describe(SubscriptionFacts.name, () => {
  it('renders status, dates and included units', () => {
    render(<SubscriptionFacts subscription={activeSubscription} />)

    expect(screen.getByText('Ativa')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(
      screen.getByText(/de (dezembro de 2025|janeiro de 2026)/)
    ).toBeInTheDocument()
  })

  it('renders unlimited units and date fallbacks', () => {
    render(
      <SubscriptionFacts
        subscription={{
          ...activeSubscription,
          isActive: false,
          plan: { ...activeSubscription.plan, maxTenants: null },
          subscriptionStatus: { id: 'status-2', name: 'Suspensa' },
          trialEndsAt: null,
          expiresAt: null,
        }}
      />
    )

    expect(screen.getByText('Suspensa')).toBeInTheDocument()
    expect(screen.getByText('ilimitadas')).toBeInTheDocument()
    expect(screen.getAllByText('—')).toHaveLength(2)
  })
})
