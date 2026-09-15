import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StoreForm } from './StoreForm'
import { storeFormTypeOptionsMock } from './StoreForm.mock'

describe(StoreForm.name, () => {
  it('renders the store fields and submit action', () => {
    render(
      <StoreForm
        typeOptions={storeFormTypeOptionsMock}
        onSubmitStore={vi.fn()}
      />
    )
    expect(screen.getByText('A loja')).toBeInTheDocument()
    expect(screen.getByText('Onde fica')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar loja' })).toBeInTheDocument()
  })
})
