import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'

import { PromotionEditorForm } from './PromotionEditorForm'
import { promotionEditorFormMock } from './PromotionEditorForm.mock'

vi.mock('@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade')

describe(PromotionEditorForm.name, () => {
  it('creates a free delivery campaign with the defaults filled in', async () => {
    const savePromotion = vi.fn()
    const cancel = vi.fn()
    vi.mocked(usePromotionEditorFacade).mockReturnValue({
      mode: 'create',
      promotion: undefined,
      zoneOptions: [{ value: 'zone-1', label: '0 a 3 km' }],
      savePromotion,
      isSaving: false,
      cancel,
    } as unknown as ReturnType<typeof usePromotionEditorFacade>)

    render(
      <MemoryRouter>
        <PromotionEditorForm />
      </MemoryRouter>
    )

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Pedido mínimo em reais' }),
      '6000'
    )
    await userEvent.click(
      screen.getByRole('button', { name: promotionEditorFormMock.submitLabel })
    )

    expect(savePromotion).toHaveBeenCalledWith(
      expect.objectContaining({
        minOrderValue: '60,00',
        zoneScope: 'all',
        showInMenu: true,
      })
    )

    await userEvent.click(
      screen.getByRole('button', { name: promotionEditorFormMock.cancelLabel })
    )
    expect(cancel).toHaveBeenCalled()
  })
})
