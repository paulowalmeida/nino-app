import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'

import { PromotionsContent } from './PromotionsContent'
import { contentPromotionsMock } from './PromotionsContent.mock'

vi.mock('@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade')

const renderContent = (path = '/promocoes') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PromotionsContent />
    </MemoryRouter>
  )

describe(PromotionsContent.name, () => {
  beforeEach(() => {
    vi.mocked(usePromotionsFacade).mockReturnValue({
      promotions: contentPromotionsMock,
      changingId: null,
    } as unknown as ReturnType<typeof usePromotionsFacade>)
  })

  it('counts the campaigns of each tab and opens on Ativas', () => {
    renderContent()

    expect(screen.getByRole('tab', { name: 'Ativas · 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Inativas · 1' })).toBeInTheDocument()
    expect(screen.getByText('Frete grátis acima de R$ 60,00')).toBeInTheDocument()
  })

  it('shows the paused campaign with its seal under Inativas', () => {
    renderContent('/promocoes?aba=inactive')

    expect(screen.getByText('Frete grátis acima de R$ 80,00')).toBeInTheDocument()
    expect(screen.getByText('Pausada')).toBeInTheDocument()
  })

  it('explains an empty search instead of an empty table', async () => {
    renderContent()

    await userEvent.type(
      screen.getByRole('searchbox', { name: /Buscar campanha/ }),
      'pizza'
    )

    expect(
      screen.getByText('Nenhuma campanha com "pizza" nesta aba.')
    ).toBeInTheDocument()
  })
})
