import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { PromotionUnavailable } from './PromotionUnavailable'
import { promotionUnavailableMock } from './PromotionUnavailable.mock'

describe(PromotionUnavailable.name, () => {
  it('explains the lock and leads back to the campaigns', async () => {
    render(
      <MemoryRouter initialEntries={['/promocoes/promotion-1']}>
        <Routes>
          <Route path="/promocoes" element={<p>lista</p>} />
          <Route path="/promocoes/:id" element={<PromotionUnavailable />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(promotionUnavailableMock.title)).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: promotionUnavailableMock.backLabel })
    )
    expect(screen.getByText('lista')).toBeInTheDocument()
  })
})
