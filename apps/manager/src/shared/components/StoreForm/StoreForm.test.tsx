import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StoreForm } from './StoreForm'
import { storeFormTypeOptionsMock } from './StoreForm.mock'

vi.mock('./StoreFormAddressFields/StoreFormAddressFields', () => ({
  StoreFormAddressFields: () => <p>Onde fica</p>,
}))

describe(StoreForm.name, () => {
  it('renders the store fields and submit action', () => {
    const onSubmitStore = vi.fn()
    render(
      <StoreForm
        typeOptions={storeFormTypeOptionsMock}
        onSubmitStore={onSubmitStore}
      />
    )
    expect(screen.getByText('A loja')).toBeInTheDocument()
    expect(screen.getByText('Onde fica')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Criar loja' }))
    expect(onSubmitStore).not.toHaveBeenCalled()
  })
})
