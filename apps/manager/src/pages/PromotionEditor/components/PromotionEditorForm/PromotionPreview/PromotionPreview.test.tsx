import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import { PromotionPreview } from './PromotionPreview'
import { previewValuesMock } from './PromotionPreview.mock'

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

vi.mock(
  '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
)

describe(PromotionPreview.name, () => {
  beforeEach(() =>
    vi.mocked(usePromotionEditorFacade).mockReturnValue({
      giftProductOptions: [
        { value: 'coke', name: 'Coca-Cola Lata', label: 'Coca-Cola Lata' },
      ],
    } as unknown as ReturnType<typeof usePromotionEditorFacade>)
  )

  it('summarizes the configured benefit and conditions', () => {
    render(
      <Form values={previewValuesMock}>
        <PromotionPreview />
      </Form>
    )

    expect(
      screen.getByRole('heading', { name: 'Confira antes de criar' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Frete grátis acima de R$ 60,00')
    ).toBeInTheDocument()
    expect(screen.getByText('ter, 18h–23h')).toBeInTheDocument()
    expect(screen.getByText('Visível no cardápio')).toBeInTheDocument()
    expect(
      screen.getByText('1 vez por cliente · primeiros 50 pedidos')
    ).toBeInTheDocument()
  })

  it('states when a campaign is hidden from the menu', () => {
    render(
      <Form
        values={{
          ...previewValuesMock,
          campaignType: 'discount',
          discountValue: '10',
          code: 'VIP',
          showInMenu: false,
        }}
      >
        <PromotionPreview />
      </Form>
    )

    expect(screen.getByText('Oculta do cardápio')).toBeInTheDocument()
    expect(screen.getByText('Cupom')).toBeInTheDocument()
    expect(screen.getByText('VIP')).toBeInTheDocument()
  })

  it('previews a capped discount without the zones fact', () => {
    render(
      <Form
        values={{
          ...previewValuesMock,
          campaignType: 'discount',
          discountValue: '10',
          maxDiscount: '15,00',
        }}
      >
        <PromotionPreview />
      </Form>
    )

    expect(
      screen.getByText(/10% de desconto \(até R\$\s15,00\) acima de R\$\s60,00/)
    ).toBeInTheDocument()
    expect(screen.queryByText('Zonas')).not.toBeInTheDocument()
  })

  it('names the chosen gift product', () => {
    render(
      <Form
        values={{
          ...previewValuesMock,
          campaignType: 'gift',
          giftProductId: 'coke',
        }}
      >
        <PromotionPreview />
      </Form>
    )

    expect(
      screen.getByText(/Ganhe Coca-Cola Lata acima de R\$\s60,00/)
    ).toBeInTheDocument()
  })
})
