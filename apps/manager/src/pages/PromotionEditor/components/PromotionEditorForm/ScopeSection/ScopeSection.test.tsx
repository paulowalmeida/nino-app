import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import { ScopeSection } from './ScopeSection'
import { scopeOptionsMock } from './ScopeSection.mock'

vi.mock(
  '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
)

const Chosen = () => {
  const ids = useWatch<PromotionFormValues, 'scopeCategoryIds'>({
    name: 'scopeCategoryIds',
  })
  return <output aria-label="categorias">{ids.join(',')}</output>
}

const Form = ({ children }: { children: ReactNode }) => {
  const form = useForm<PromotionFormValues>({
    defaultValues: {
      productScope: 'all',
      scopeCategoryIds: [],
      scopeProductIds: [],
    } as unknown as PromotionFormValues,
  })
  return <FormProvider {...form}>{children}</FormProvider>
}

describe(ScopeSection.name, () => {
  it('reveals the category choice only when the discount covers some items', async () => {
    vi.mocked(usePromotionEditorFacade).mockReturnValue(
      scopeOptionsMock as unknown as ReturnType<typeof usePromotionEditorFacade>
    )
    render(
      <Form>
        <ScopeSection />
        <Chosen />
      </Form>
    )

    expect(screen.queryByText('Lanches')).not.toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('radio', { name: 'Só alguns itens' })
    )
    await userEvent.click(screen.getByRole('button', { name: 'Lanches' }))

    expect(screen.getByLabelText('categorias')).toHaveTextContent('burgers')
  })
})
