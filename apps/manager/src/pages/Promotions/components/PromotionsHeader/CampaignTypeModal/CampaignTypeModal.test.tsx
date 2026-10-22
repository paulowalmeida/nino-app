import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CampaignTypeModal } from './CampaignTypeModal'
import { campaignTypeModalMock } from './CampaignTypeModal.mock'

const renderModal = () =>
  render(
    <MemoryRouter initialEntries={['/promocoes']}>
      <Routes>
        <Route
          path="/promocoes"
          element={<CampaignTypeModal open onOpenChange={vi.fn()} />}
        />
        <Route path="/promocoes/nova" element={<p>formulário</p>} />
      </Routes>
    </MemoryRouter>
  )

describe(CampaignTypeModal.name, () => {
  it('offers free delivery and keeps the other types as coming soon', async () => {
    renderModal()

    expect(
      await screen.findByRole('radio', { name: campaignTypeModalMock.freeDelivery })
    ).toBeChecked()
    expect(
      screen.getByRole('radio', { name: campaignTypeModalMock.discount })
    ).toBeDisabled()
  })

  it('continues to the campaign form', async () => {
    renderModal()

    await userEvent.click(
      await screen.findByRole('button', { name: campaignTypeModalMock.continueLabel })
    )

    expect(screen.getByText('formulário')).toBeInTheDocument()
  })
})
