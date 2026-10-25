import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import { BenefitSection } from './BenefitSection'
import { benefitDefaultsMock } from './BenefitSection.mock'

const Form = ({
  children,
  defaults = {},
  onValid = () => undefined,
}: {
  children: ReactNode
  defaults?: Partial<PromotionFormValues>
  onValid?: (values: PromotionFormValues) => void
}) => {
  const form = useForm<PromotionFormValues>({
    defaultValues: {
      ...benefitDefaultsMock,
      ...defaults,
    } as PromotionFormValues,
  })
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)}>
        {children}
        <button type="submit">enviar</button>
      </form>
    </FormProvider>
  )
}

vi.mock(
  '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
)

describe(BenefitSection.name, () => {
  it('types the minimum order as money, right to left', async () => {
    vi.mocked(usePromotionEditorFacade).mockReturnValue({
      mode: 'create',
      giftProductOptions: [],
    } as unknown as ReturnType<typeof usePromotionEditorFacade>)
    render(
      <Form>
        <BenefitSection />
      </Form>
    )

    const field = screen.getByRole('textbox', {
      name: 'Pedido mínimo em reais',
    })
    await userEvent.type(field, '6000')

    expect(field).toHaveValue('60,00')
  })

  it('asks for the discount and offers a cap only on percentage', async () => {
    vi.mocked(usePromotionEditorFacade).mockReturnValue({
      mode: 'create',
      giftProductOptions: [],
    } as unknown as ReturnType<typeof usePromotionEditorFacade>)
    const onValid = vi.fn()
    render(
      <Form defaults={{ campaignType: 'discount' }} onValid={onValid}>
        <BenefitSection />
      </Form>
    )

    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))
    expect(await screen.findByText('Informe o desconto')).toBeInTheDocument()

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Desconto em percentual' }),
      '150'
    )
    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))
    expect(
      await screen.findByText('O percentual vai até 100')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Teto do desconto em reais' })
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('radio', { name: 'Valor fixo' }))
    expect(
      screen.queryByRole('textbox', { name: 'Teto do desconto em reais' })
    ).not.toBeInTheDocument()
  })

  it('asks which product is the gift', async () => {
    vi.mocked(usePromotionEditorFacade).mockReturnValue({
      mode: 'create',
      giftProductOptions: [
        { value: 'coke', name: 'Coca-Cola Lata', label: 'Coca-Cola Lata' },
      ],
    } as unknown as ReturnType<typeof usePromotionEditorFacade>)
    const onValid = vi.fn()
    render(
      <Form defaults={{ campaignType: 'gift' }} onValid={onValid}>
        <BenefitSection />
      </Form>
    )

    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))

    expect(
      await screen.findByText('Escolha o produto de brinde')
    ).toBeInTheDocument()
    expect(onValid).not.toHaveBeenCalled()
  })
})
