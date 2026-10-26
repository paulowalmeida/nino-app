import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'

import { PromotionEditorForm } from './PromotionEditorForm'
import { promotionEditorFormMock } from './PromotionEditorForm.mock'

vi.mock(
  '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
)

const savePromotion = vi.fn()
const cancel = vi.fn()

const renderForm = () =>
  render(
    <MemoryRouter>
      <PromotionEditorForm />
    </MemoryRouter>
  )

const next = () =>
  userEvent.click(
    screen.getByRole('button', { name: promotionEditorFormMock.nextLabel })
  )

describe(PromotionEditorForm.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePromotionEditorFacade).mockReturnValue({
      mode: 'create',
      promotion: undefined,
      zoneOptions: [{ value: 'zone-1', label: '0 a 3 km' }],
      giftProductOptions: [],
      savePromotion,
      isSaving: false,
      cancel,
    } as unknown as ReturnType<typeof usePromotionEditorFacade>)
  })

  it('walks the steps and creates the campaign on the last one', async () => {
    renderForm()

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Desconto em percentual' }),
      '10'
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Pedido mínimo em reais' }),
      '6000'
    )
    await next()
    expect(screen.getByRole('button', { name: 'ter' })).toBeInTheDocument()
    await next()
    await userEvent.type(screen.getByRole('textbox', { name: 'Código' }), 'vip')
    expect(
      screen.queryByRole('button', { name: promotionEditorFormMock.nextLabel })
    ).not.toBeInTheDocument()
    expect(savePromotion).not.toHaveBeenCalled()

    await userEvent.click(
      screen.getByRole('button', { name: promotionEditorFormMock.submitLabel })
    )

    expect(savePromotion).toHaveBeenCalledWith(
      expect.objectContaining({
        campaignType: 'discount',
        discountValue: '10',
        minOrderValue: '60,00',
        code: 'VIP',
      })
    )
  })

  it('pressing Enter before the last step advances instead of saving', async () => {
    renderForm()

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Desconto em percentual' }),
      '10'
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Pedido mínimo em reais' }),
      '6000{Enter}'
    )

    expect(savePromotion).not.toHaveBeenCalled()
    expect(
      await screen.findByRole('button', { name: 'ter' })
    ).toBeInTheDocument()
  })

  it('cancels on the first step and goes back on the next ones', async () => {
    renderForm()

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Desconto em percentual' }),
      '10'
    )
    await next()
    await userEvent.click(
      screen.getByRole('button', { name: promotionEditorFormMock.backLabel })
    )
    expect(
      screen.getByRole('textbox', { name: 'Pedido mínimo em reais' })
    ).toHaveValue('')

    await userEvent.click(
      screen.getByRole('button', { name: promotionEditorFormMock.cancelLabel })
    )
    expect(cancel).toHaveBeenCalled()
  })
})
