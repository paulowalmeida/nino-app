import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'

import { ProductModifierGroupEditor } from './ProductModifierGroupEditor'
import { productModifierGroupEditorFormMock } from './ProductModifierGroupEditor.mock'

const GroupForm = () => {
  const form = useForm<ProductDetailFormValues>({
    defaultValues: productModifierGroupEditorFormMock,
  })
  return (
    <FormProvider {...form}>
      <ProductModifierGroupEditor groupIndex={0} removeGroup={vi.fn()} />
    </FormProvider>
  )
}

describe('ProductModifierGroupEditor', () => {
  it('keeps one option and allows another to be added', async () => {
    render(<GroupForm />)
    expect(screen.getByLabelText('Opção 1')).toHaveValue('Queijo')
    expect(screen.getByRole('button', { name: 'Remover' })).toBeDisabled()

    await userEvent.click(
      screen.getByRole('button', { name: 'Adicionar opção' })
    )

    expect(screen.getByLabelText('Opção 2')).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button', { name: 'Remover' })[1])
    expect(screen.queryByLabelText('Opção 2')).not.toBeInTheDocument()
  })
})
