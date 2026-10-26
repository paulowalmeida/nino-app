import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { previewValuesMock } from '@pages/PromotionEditor/components/PromotionEditorForm/PromotionPreview/PromotionPreview.mock'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import { MenuPreview } from './MenuPreview'

vi.mock(
  '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
)

const Form = ({
  children,
  values,
}: {
  children: ReactNode
  values: PromotionFormValues
}) => {
  const form = useForm<PromotionFormValues>({ defaultValues: values })
  return <FormProvider {...form}>{children}</FormProvider>
}

const renderPreview = (values: Partial<PromotionFormValues> = {}) =>
  render(
    <Form values={{ ...previewValuesMock, ...values }}>
      <MenuPreview />
    </Form>
  )

describe(MenuPreview.name, () => {
  beforeEach(() =>
    vi.mocked(usePromotionEditorFacade).mockReturnValue({
      giftProductOptions: [
        { value: 'coke', name: 'Coca-Cola Lata', label: 'Coca-Cola Lata' },
      ],
    } as unknown as ReturnType<typeof usePromotionEditorFacade>)
  )

  it('shows the menu strip with the campaign condition', () => {
    renderPreview()

    expect(screen.getByText('Topo do cardápio')).toBeInTheDocument()
    expect(
      screen.getByText('Frete grátis acima de R$ 60,00')
    ).toBeInTheDocument()
  })

  it('explains a coupon campaign hidden from the menu', () => {
    renderPreview({
      campaignType: 'discount',
      discountValue: '10',
      code: 'VIP',
      showInMenu: false,
    })

    expect(screen.queryByText('Topo do cardápio')).not.toBeInTheDocument()
    expect(
      screen.getByText('Fora do cardápio: só vale para quem digitar VIP.')
    ).toBeInTheDocument()
  })

  it('previews a package as its card in the promotions section', () => {
    renderPreview({ campaignType: 'package', packagePrice: '49,90' })

    expect(screen.getByText('Seção Promoções')).toBeInTheDocument()
    expect(screen.getByText(/^R\$\s49,90$/)).toBeInTheDocument()
  })

  it('asks for an image when the campaign goes to the carousel', () => {
    renderPreview({
      campaignType: 'gift',
      giftProductId: 'coke',
      showInBanner: true,
    })

    expect(
      screen.getByText('Envie uma imagem para a campanha entrar no carrossel.')
    ).toBeInTheDocument()
  })
})
