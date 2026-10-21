import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { SubscriptionPlanChangeHeader } from './SubscriptionPlanChangeHeader'
import { subscriptionPlanChangeHeaderMock } from './SubscriptionPlanChangeHeader.mock'

describe(SubscriptionPlanChangeHeader.name, () => {
  it('names the confirmation step when a plan was selected', async () => {
    render(
      <MemoryRouter
        initialEntries={['/unit-1/assinatura/planos/plan-1/confirmar']}
      >
        <Routes>
          <Route
            path="/:unitId/assinatura/planos/:planId/confirmar"
            element={<SubscriptionPlanChangeHeader isConfirmation />}
          />
          <Route path="/:unitId/assinatura/planos" element={<p>plans</p>} />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', {
        name: subscriptionPlanChangeHeaderMock.confirmationTitle,
      })
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(screen.getByText('plans')).toBeInTheDocument()
  })

  it('returns to the subscription summary from plan selection', async () => {
    render(
      <MemoryRouter initialEntries={['/unit-1/assinatura/planos']}>
        <Routes>
          <Route
            path="/:unitId/assinatura/planos"
            element={<SubscriptionPlanChangeHeader isConfirmation={false} />}
          />
          <Route path="/:unitId/assinatura" element={<p>subscription</p>} />
        </Routes>
      </MemoryRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(screen.getByText('subscription')).toBeInTheDocument()
  })
})
