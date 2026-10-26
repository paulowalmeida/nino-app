import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { filledFormMock } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter.mock'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import { ZonesSection } from './ZonesSection'
import { zoneOptionsMock } from './ZonesSection.mock'

vi.mock(
  '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
)

const Form = ({
  children,
  onValid,
}: {
  children: ReactNode
  onValid: (values: PromotionFormValues) => void
}) => {
  const form = useForm<PromotionFormValues>({
    defaultValues: { ...filledFormMock, zoneScope: 'all', deliveryZoneIds: [] },
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

const withZones = (zoneOptions = zoneOptionsMock) =>
  vi.mocked(usePromotionEditorFacade).mockReturnValue({
    zoneOptions,
  } as unknown as ReturnType<typeof usePromotionEditorFacade>)

describe(ZonesSection.name, () => {
  it('asks for at least one zone when the owner restricts them', async () => {
    withZones()
    const onValid = vi.fn()
    render(
      <Form onValid={onValid}>
        <ZonesSection />
      </Form>
    )

    await userEvent.click(screen.getByRole('radio', { name: /Só as zonas/ }))
    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Marque pelo menos uma zona'
    )
    expect(onValid).not.toHaveBeenCalled()

    await userEvent.click(
      screen.getByRole('checkbox', { name: zoneOptionsMock[1].label })
    )
    await userEvent.click(screen.getByRole('button', { name: 'enviar' }))

    expect(onValid).toHaveBeenCalledWith(
      expect.objectContaining({
        zoneScope: 'chosen',
        deliveryZoneIds: zoneOptionsMock.slice(0, 2).map(({ value }) => value),
      }),
      expect.anything()
    )
  })

  it('warns when the unit has no active zone', () => {
    withZones([])
    render(
      <Form onValid={vi.fn()}>
        <ZonesSection />
      </Form>
    )

    expect(
      screen.getByText('A unidade não tem zonas ativas')
    ).toBeInTheDocument()
  })
})
