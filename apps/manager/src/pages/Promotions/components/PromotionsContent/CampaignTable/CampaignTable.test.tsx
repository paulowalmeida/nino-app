import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePromotionsFacade } from '@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade'

import { CampaignTable } from './CampaignTable'
import {
  campaignTableEmptyMock,
  unusedPausedCampaignMock,
  usedActiveCampaignMock,
} from './CampaignTable.mock'

vi.mock('@pages/Promotions/facades/usePromotionsFacade/usePromotionsFacade')

const pause = vi.fn()
const resume = vi.fn()
const end = vi.fn()

const renderTable = (promotions = [usedActiveCampaignMock, unusedPausedCampaignMock]) =>
  render(
    <MemoryRouter initialEntries={['/promocoes']}>
      <Routes>
        <Route
          path="/promocoes"
          element={
            <CampaignTable
              promotions={promotions}
              emptyMessage={campaignTableEmptyMock}
            />
          }
        />
        <Route path="/promocoes/nova" element={<p>nova campanha</p>} />
        <Route path="/promocoes/:id" element={<p>editar campanha</p>} />
      </Routes>
    </MemoryRouter>
  )

const openActions = async (headline: string) =>
  userEvent.click(
    screen.getByRole('button', {
      name: `Ações de ${headline.replace('R$ ', 'R$\u00a0')}`,
    })
  )

describe(CampaignTable.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePromotionsFacade).mockReturnValue({
      pause,
      resume,
      end,
      isEnding: false,
      changingId: null,
    } as unknown as ReturnType<typeof usePromotionsFacade>)
  })

  it('reads each campaign as a sentence with its conditions and usage', () => {
    renderTable()

    const row = screen.getByText('Frete grátis acima de R$ 60,00').closest('tr')!
    expect(
      within(row).getByText('ter, 18h–23h · código FRETE · fora do cardápio')
    ).toBeInTheDocument()
    expect(within(row).getByText('12 de 50')).toBeInTheDocument()
    expect(within(row).getByText('Sem data de fim')).toBeInTheDocument()
  })

  it('pauses an active campaign and hides edit once it was used', async () => {
    renderTable()

    await openActions('Frete grátis acima de R$ 60,00')

    expect(screen.queryByRole('menuitem', { name: 'Editar' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Pausar' }))
    expect(pause).toHaveBeenCalledWith(usedActiveCampaignMock.id)
  })

  it('resumes a paused campaign', async () => {
    renderTable()

    await openActions('Frete grátis acima de R$ 80,00')
    await userEvent.click(screen.getByRole('menuitem', { name: 'Retomar' }))

    expect(resume).toHaveBeenCalledWith(unusedPausedCampaignMock.id)
  })

  it('asks before ending a campaign for good', async () => {
    renderTable()

    await openActions('Frete grátis acima de R$ 60,00')
    await userEvent.click(screen.getByRole('menuitem', { name: 'Finalizar' }))
    expect(end).not.toHaveBeenCalled()

    await userEvent.click(await screen.findByRole('button', { name: 'Finalizar' }))
    expect(end).toHaveBeenCalledWith(usedActiveCampaignMock.id, expect.anything())
  })

  it('duplicates into a new campaign form', async () => {
    renderTable()

    await openActions('Frete grátis acima de R$ 60,00')
    await userEvent.click(screen.getByRole('menuitem', { name: 'Duplicar' }))

    expect(screen.getByText('nova campanha')).toBeInTheDocument()
  })

  it('explains an empty tab', () => {
    renderTable([])

    expect(screen.getByText(campaignTableEmptyMock)).toBeInTheDocument()
  })
})
