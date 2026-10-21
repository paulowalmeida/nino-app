import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SubscriptionPlanChange } from './SubscriptionPlanChange'

vi.mock(
  './components/SubscriptionPlanChangeContent/SubscriptionPlanChangeContent',
  () => ({ SubscriptionPlanChangeContent: () => <div>plan content</div> })
)

describe(SubscriptionPlanChange.name, () => {
  it('shows the plan choice journey', () => {
    render(
      <MemoryRouter initialEntries={['/unit-1/assinatura/planos']}>
        <Routes>
          <Route
            path="/:unitId/assinatura/planos"
            element={<SubscriptionPlanChange />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: 'Escolha um plano' })
    ).toBeInTheDocument()
  })
})
