import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { PromotionsHeader } from './PromotionsHeader'
import { promotionsHeaderMock } from './PromotionsHeader.mock'

describe(PromotionsHeader.name, () => {
  it('opens the campaign type choice from Nova campanha', async () => {
    render(
      <MemoryRouter>
        <PromotionsHeader />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: promotionsHeaderMock.title })
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: promotionsHeaderMock.action })
    )

    expect(
      await screen.findByText(promotionsHeaderMock.modalTitle)
    ).toBeInTheDocument()
  })
})
