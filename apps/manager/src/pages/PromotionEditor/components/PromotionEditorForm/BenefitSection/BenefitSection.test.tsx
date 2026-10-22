import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import { BenefitSection } from './BenefitSection'
import { benefitDefaultsMock } from './BenefitSection.mock'

const Form = ({ children }: { children: ReactNode }) => {
  const form = useForm<PromotionFormValues>({
    defaultValues: benefitDefaultsMock as PromotionFormValues,
  })
  return <FormProvider {...form}>{children}</FormProvider>
}

describe(BenefitSection.name, () => {
  it('types the minimum order as money, right to left', async () => {
    render(
      <Form>
        <BenefitSection />
      </Form>
    )

    const field = screen.getByRole('textbox', { name: 'Pedido mínimo em reais' })
    await userEvent.type(field, '6000')

    expect(field).toHaveValue('60,00')
  })
})
