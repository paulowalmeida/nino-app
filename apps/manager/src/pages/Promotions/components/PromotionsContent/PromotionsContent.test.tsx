import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'
import { promotionListQueryMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { PromotionsContent } from './PromotionsContent'
import { contentPromotionsMock } from './PromotionsContent.mock'

vi.mock('@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade')

const changeTab = vi.fn()
const changeTerm = vi.fn()
const changePage = vi.fn()

const withFacade = (overrides: Record<string, unknown> = {}) =>
  vi.mocked(usePromotionsFacade).mockReturnValue({
    promotions: contentPromotionsMock.slice(0, 1),
    tabCounts: { active: 1, scheduled: 0, inactive: 1 },
    total: 1,
    query: promotionListQueryMock,
    term: '',
    changeTab,
    changeTerm,
    changePage,
    changingId: null,
    ...overrides,
  } as unknown as ReturnType<typeof usePromotionsFacade>)

const renderContent = () =>
  render(
    <MemoryRouter>
      <PromotionsContent />
    </MemoryRouter>
  )

describe(PromotionsContent.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    withFacade()
  })

  it('labels each tab with the count the API returned', () => {
    renderContent()

    expect(screen.getByRole('tab', { name: 'Ativas · 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Inativas · 1' })).toBeInTheDocument()
    expect(screen.getByText('Frete grátis acima de R$ 60,00')).toBeInTheDocument()
  })

  it('hands tab and search changes to the facade', async () => {
    renderContent()

    await userEvent.click(screen.getByRole('tab', { name: 'Inativas · 1' }))
    expect(changeTab).toHaveBeenCalledWith('inactive')

    await userEvent.type(
      screen.getByRole('searchbox', { name: /Buscar campanha/ }),
      'a'
    )
    expect(changeTerm).toHaveBeenCalledWith('a')
  })

  it('explains an empty search instead of an empty table', () => {
    withFacade({
      promotions: [],
      total: 0,
      query: { ...promotionListQueryMock, search: 'pizza' },
    })
    renderContent()

    expect(
      screen.getByText('Nenhuma campanha com "pizza" nesta aba.')
    ).toBeInTheDocument()
  })

  it('pages through the results only when they do not fit one page', async () => {
    withFacade({ total: 45 })
    renderContent()

    await userEvent.click(screen.getByRole('button', { name: /2/ }))
    expect(changePage).toHaveBeenCalledWith(2)
  })
})
