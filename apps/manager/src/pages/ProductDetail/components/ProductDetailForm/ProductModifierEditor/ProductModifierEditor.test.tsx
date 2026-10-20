import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'

import { ProductModifierEditor } from './ProductModifierEditor'
import { productModifierEditorFormMock } from './ProductModifierEditor.mock'

const EditorForm = () => {
  const form = useForm<ProductDetailFormValues>({
    defaultValues: productModifierEditorFormMock,
  })
  return (
    <FormProvider {...form}>
      <ProductModifierEditor />
    </FormProvider>
  )
}

describe('ProductModifierEditor', () => {
  it('starts empty and creates a choice section', async () => {
    render(<EditorForm />)
    expect(
      screen.getByText('Este produto ainda não possui escolhas configuradas.')
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Adicionar seção' })
    )

    expect(screen.getByLabelText('Nome da seção')).toBeInTheDocument()
    expect(screen.getByLabelText('Opção 1')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Remover seção' }))
    expect(
      screen.getByText('Este produto ainda não possui escolhas configuradas.')
    ).toBeInTheDocument()
  })
})
