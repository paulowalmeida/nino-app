import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSubscriptionPlanChangeFacade } from '../../facades/useSubscriptionPlanChangeFacade/useSubscriptionPlanChangeFacade'
import { subscriptionPlanChoiceMock } from '../SubscriptionPlanChoice/SubscriptionPlanChoice.mock'
import { SubscriptionPlanChangeContent } from './SubscriptionPlanChangeContent'
import { subscriptionPlanChangeContentMock } from './SubscriptionPlanChangeContent.mock'

vi.mock(
  '../../facades/useSubscriptionPlanChangeFacade/useSubscriptionPlanChangeFacade'
)

const renderContent = (path = '/unit-1/assinatura/planos') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/:unitId/assinatura/planos"
          element={<SubscriptionPlanChangeContent />}
        />
        <Route
          path="/:unitId/assinatura/planos/:planId/confirmar"
          element={<SubscriptionPlanChangeContent planId="plan-standard" />}
        />
        <Route
          path="/:unitId/assinatura"
          element={<p>subscription summary</p>}
        />
        <Route path="/:unitId/assinatura/rede" element={<p>interest form</p>} />
      </Routes>
    </MemoryRouter>
  )

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useSubscriptionPlanChangeFacade).mockReturnValue({
    subscription: {
      isActive: true,
      plan: subscriptionPlanChoiceMock.currentPlan,
    },
    plans: subscriptionPlanChoiceMock.plans,
    isPending: false,
    isError: false,
    isUpdating: false,
    isUpdateError: false,
    changePlan: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as ReturnType<typeof useSubscriptionPlanChangeFacade>)

describe(SubscriptionPlanChangeContent.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows loading feedback while the plan journey is loading', () => {
    facadeWith({ isPending: true })

    renderContent()

    expect(screen.getByRole('alert')).toHaveTextContent(
      subscriptionPlanChangeContentMock.loadingMessage
    )
  })

  it('reports unavailable subscription data', () => {
    facadeWith({ isError: true })

    renderContent()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os planos disponíveis.'
    )
  })

  it('keeps an invalid selected plan out of the confirmation step', async () => {
    facadeWith({})

    render(
      <MemoryRouter
        initialEntries={['/unit-1/assinatura/planos/plan-pro/confirmar']}
      >
        <Routes>
          <Route
            path="/:unitId/assinatura/planos/:planId/confirmar"
            element={<SubscriptionPlanChangeContent planId="plan-pro" />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Esse plano não está disponível para alteração.'
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Voltar para os planos' })
    )
  })

  it('returns from confirmation and can open the custom proposal flow', async () => {
    facadeWith({})

    renderContent('/unit-1/assinatura/planos/plan-standard/confirmar')

    await userEvent.click(
      screen.getByRole('button', { name: 'Voltar e revisar' })
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Solicitar proposta' })
    )

    expect(screen.getByText('interest form')).toBeInTheDocument()
  })

  it('moves from selection to confirmation and then returns to the summary', async () => {
    const changePlan = vi.fn().mockResolvedValue(undefined)
    facadeWith({ changePlan })

    renderContent()

    await userEvent.click(screen.getByText('Padrão'))
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByText('Novo plano')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Confirmar alteração' })
    )

    await waitFor(() =>
      expect(changePlan).toHaveBeenCalledWith('plan-standard')
    )
    expect(screen.getByText('subscription summary')).toBeInTheDocument()
  })
})
