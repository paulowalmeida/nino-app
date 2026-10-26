import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import { CodeSection } from './CodeSection'
import { codeDefaultsMock } from './CodeSection.mock'

const Form = ({ children }: { children: ReactNode }) => {
  const form = useForm<PromotionFormValues>({
    defaultValues: codeDefaultsMock as PromotionFormValues,
  })
  return <FormProvider {...form}>{children}</FormProvider>
}

const renderSection = () =>
  render(
    <Form>
      <CodeSection />
    </Form>
  )

describe(CodeSection.name, () => {
  it('hides a coded campaign from the menu by default and shows it again without code', async () => {
    renderSection()
    const visibility = screen.getByRole('checkbox', {
      name: 'Mostrar no cardápio',
    })
    const code = screen.getByRole('textbox', { name: /Código/ })

    expect(visibility).toBeChecked()
    await userEvent.type(code, 'frete ja')
    expect(code).toHaveValue('FRETEJA')
    expect(visibility).not.toBeChecked()

    await userEvent.clear(code)
    expect(visibility).toBeChecked()
  })

  it('keeps the visibility the owner chose by hand', async () => {
    renderSection()
    const visibility = screen.getByRole('checkbox', {
      name: 'Mostrar no cardápio',
    })

    await userEvent.click(visibility)
    await userEvent.click(visibility)
    await userEvent.type(screen.getByRole('textbox', { name: /Código/ }), 'VIP')

    expect(visibility).toBeChecked()
  })
})
