import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import { AddressCreation } from './AddressCreation'
import { addressCreationMock } from './AddressCreation.mock'

vi.mock('@pages/Addresses/facades/useAddressesFacade/useAddressesFacade')
vi.mock('@pages/Addresses/components/AddressForm/AddressForm', () => ({
  AddressForm: () => <div>Formulário de endereço</div>,
}))

describe('AddressCreation', () => {
  it('starts creation from the add address action', async () => {
    const startEditingAddress = vi.fn()
    vi.mocked(useAddressesFacade).mockReturnValue({
      editingAddressId: null,
      startEditingAddress,
      cancelEditingAddress: vi.fn(),
    } as unknown as ReturnType<typeof useAddressesFacade>)

    render(<AddressCreation />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Adicionar endereço' })
    )

    expect(startEditingAddress).toHaveBeenCalledWith(
      addressCreationMock.newAddressId
    )
  })

  it('shows the form while a new address is being created', () => {
    vi.mocked(useAddressesFacade).mockReturnValue({
      editingAddressId: addressCreationMock.newAddressId,
      startEditingAddress: vi.fn(),
      cancelEditingAddress: vi.fn(),
    } as unknown as ReturnType<typeof useAddressesFacade>)

    render(<AddressCreation />)

    expect(screen.getByText('Novo endereço')).toBeInTheDocument()
    expect(screen.getByText('Formulário de endereço')).toBeInTheDocument()
  })
})
