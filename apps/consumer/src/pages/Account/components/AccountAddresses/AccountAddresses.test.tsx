import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  useAccountFacade,
} from '@pages/account/facades/useAccountFacade/useAccountFacade'

import { AccountAddresses } from './AccountAddresses'
import { accountAddressesMock } from './AccountAddresses.mock'

vi.mock('@pages/account/facades/useAccountFacade/useAccountFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAccountFacade).mockReturnValue({
    addresses: [],
    isAddressesPending: false,
    editingAddressId: null,
    startEditingAddress: vi.fn(),
    cancelEditingAddress: vi.fn(),
    confirmingDeleteAddressId: null,
    requestDeleteAddress: vi.fn(),
    cancelDeleteAddress: vi.fn(),
    saveAddress: vi.fn(),
    isSavingAddress: false,
    hasSaveAddressError: false,
    deleteAddress: vi.fn(),
    isDeletingAddress: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAccountFacade>)

describe('AccountAddresses', () => {
  it('shows the empty state when there is no address saved', () => {
    // Arrange
    facadeWith({ addresses: [] })

    // Act
    render(<AccountAddresses />)

    // Assert
    expect(
      screen.getByText(/Você ainda não salvou nenhum endereço/)
    ).toBeInTheDocument()
  })

  it('lists each saved address', () => {
    // Arrange
    facadeWith({ addresses: accountAddressesMock.addresses })

    // Act
    render(<AccountAddresses />)

    // Assert
    expect(screen.getByText(/Rua das Flores, 123/)).toBeInTheDocument()
  })

  it('asks the store to open the new address form', () => {
    // Arrange
    const startEditingAddress = vi.fn()
    facadeWith({ addresses: [], startEditingAddress })

    // Act
    render(<AccountAddresses />)
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar endereço' }))

    // Assert
    expect(startEditingAddress).toHaveBeenCalledWith('new')
  })

  it('renders the new address form when the store says so', () => {
    // Arrange
    facadeWith({ addresses: [], editingAddressId: 'new' })

    // Act
    render(<AccountAddresses />)

    // Assert
    expect(screen.getByText('Novo endereço')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Adicionar endereço' })
    ).not.toBeInTheDocument()
  })
})
