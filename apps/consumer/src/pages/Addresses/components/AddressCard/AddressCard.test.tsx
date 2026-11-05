import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import { AddressCard } from './AddressCard'
import { addressCardMock } from './AddressCard.mock'

vi.mock('@shared/hooks/useStoreAddressSearch/useStoreAddressSearch', () => ({
  useStoreAddressSearch: vi.fn(() => ({
    suggestions: [],
    isSearching: false,
    resolveSelectedAddress: vi.fn(),
    isResolvingSelectedAddress: false,
  })),
}))
vi.mock('@pages/Addresses/facades/useAddressesFacade/useAddressesFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAddressesFacade).mockReturnValue({
    editingAddressId: null,
    startEditingAddress: vi.fn(),
    cancelEditingAddress: vi.fn(),
    confirmingDeleteAddressId: null,
    requestDeleteAddress: vi.fn(),
    cancelDeleteAddress: vi.fn(),
    saveAddress: vi.fn(),
    isSavingAddress: false,
    deleteAddress: vi.fn(),
    isDeletingAddress: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAddressesFacade>)

describe('AddressCard', () => {
  it('composes the address summary and actions in display mode', () => {
    facadeWith({})

    render(<AddressCard address={addressCardMock.address} />)

    expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Editar endereço' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Excluir endereço' })
    ).toBeInTheDocument()
  })

  it('renders the form in place of the display regions while editing', () => {
    facadeWith({ editingAddressId: addressCardMock.address.id })

    render(<AddressCard address={addressCardMock.address} />)

    expect(
      screen.getByRole('button', { name: 'Salvar endereço' })
    ).toBeInTheDocument()
    expect(screen.queryByText('Principal')).not.toBeInTheDocument()
  })
})
