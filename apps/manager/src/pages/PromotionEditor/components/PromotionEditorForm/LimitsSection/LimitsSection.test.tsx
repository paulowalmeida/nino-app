import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import { LimitsSection } from './LimitsSection'
import { limitsDefaultsMock } from './LimitsSection.mock'

const Form = ({
  children,
  onValid,
}: {
  children: ReactNode
  onValid: (values: PromotionFormValues) => void
}) => {
  const form = useForm<PromotionFormValues>({
    defaultValues: limitsDefaultsMock as PromotionFormValues,
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

describe(LimitsSection.name, () => {
  it('asks how many times when each customer may use it more than once', async () => {
    const onValid = vi.fn()
    render(
      <Form onValid={onValid}>
        <LimitsSection />
      </Form>
    )

    expect(
      screen.queryByText('Quantas vezes cada cliente')
    ).not.toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('radio', { name: 'Mais de uma vez' })
    )
    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))

    expect(await screen.findByText('Informe 2 ou mais')).toBeInTheDocument()
    expect(onValid).not.toHaveBeenCalled()
  })

  it('accepts unlimited uses with no total cap', async () => {
    const onValid = vi.fn()
    render(
      <Form onValid={onValid}>
        <LimitsSection />
      </Form>
    )

    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))

    expect(onValid).toHaveBeenCalledWith(
      expect.objectContaining({ perCustomer: 'unlimited', totalLimit: '' }),
      expect.anything()
    )
  })
})
