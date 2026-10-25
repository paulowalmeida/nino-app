import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'

import { PromotionEditorHeader } from './PromotionEditorHeader'
import { promotionEditorHeaderMock } from './PromotionEditorHeader.mock'

vi.mock(
  '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
)

describe(PromotionEditorHeader.name, () => {
  it('names the editing mode and links back to the campaigns', () => {
    vi.mocked(usePromotionEditorFacade).mockReturnValue({
      mode: 'duplicate',
    } as unknown as ReturnType<typeof usePromotionEditorFacade>)

    render(
      <MemoryRouter>
        <PromotionEditorHeader />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: promotionEditorHeaderMock.backLabel })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: promotionEditorHeaderMock.duplicateTitle,
      })
    ).toBeInTheDocument()
  })
})
