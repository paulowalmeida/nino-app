import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { PromotionsHeader } from './PromotionsHeader'
import { promotionsHeaderMock } from './PromotionsHeader.mock'

describe(PromotionsHeader.name, () => {
  it('goes straight to the new campaign screen, without a modal', async () => {
    render(
      <MemoryRouter initialEntries={['/promocoes']}>
        <Routes>
          <Route path="/promocoes" element={<PromotionsHeader />} />
          <Route path="/promocoes/nova" element={<p>nova campanha</p>} />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: promotionsHeaderMock.title })
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: promotionsHeaderMock.action })
    )

    expect(screen.getByText('nova campanha')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
