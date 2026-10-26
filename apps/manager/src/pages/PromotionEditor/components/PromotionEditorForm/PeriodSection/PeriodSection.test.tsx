import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { filledFormMock } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter.mock'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import { PeriodSection } from './PeriodSection'
import { periodSectionMock } from './PeriodSection.mock'

const Form = ({
  children,
  defaults,
  onValid,
}: {
  children: ReactNode
  defaults: Partial<PromotionFormValues>
  onValid: (values: PromotionFormValues) => void
}) => {
  const form = useForm<PromotionFormValues>({
    defaultValues: { ...filledFormMock, ...defaults },
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

describe(PeriodSection.name, () => {
  it('toggles weekdays as chips', async () => {
    const onValid = vi.fn()
    render(
      <Form defaults={{ weekdays: [] }} onValid={onValid}>
        <PeriodSection />
      </Form>
    )

    await userEvent.click(screen.getByRole('button', { name: 'ter' }))
    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))

    expect(screen.getByRole('button', { name: 'ter' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(onValid).toHaveBeenCalledWith(
      expect.objectContaining({ weekdays: [2] }),
      expect.anything()
    )
  })

  it('refuses an end before the start', async () => {
    const onValid = vi.fn()
    render(
      <Form
        defaults={{ endsAtDate: periodSectionMock.endBeforeStart }}
        onValid={onValid}
      >
        <PeriodSection />
      </Form>
    )

    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))

    expect(
      await screen.findByText('O fim precisa ser depois do início')
    ).toBeInTheDocument()
    expect(onValid).not.toHaveBeenCalled()
  })

  it('refuses a daily window that starts and ends at the same time', async () => {
    const onValid = vi.fn()
    render(
      <Form
        defaults={{ dailyStartTime: '18:00', dailyEndTime: '18:00' }}
        onValid={onValid}
      >
        <PeriodSection />
      </Form>
    )

    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'O horário precisa ter início e fim diferentes'
    )
  })
})
