import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAccountFacade } from '@pages/account/facades/useAccountFacade/useAccountFacade'

import { AddressCard } from './AddressCard'
import { addressCardMock } from './AddressCard.mock'

vi.mock('@pages/account/facades/useAccountFacade/useAccountFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAccountFacade).mockReturnValue({
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

describe('AddressCard', () => {
  it('shows the street line, the city line, and the primary badge', () => {
    // Arrange
    facadeWith({})

    // Act
    render(<AddressCard address={addressCardMock.address} />)

    // Assert
    expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument()
    expect(
      screen.getByText('Centro · São Paulo/SP · 01001000')
    ).toBeInTheDocument()
    expect(screen.getByText('Principal')).toBeInTheDocument()
  })

  it('hides the "tornar principal" tool for the primary address', () => {
    // Arrange
    facadeWith({})

    // Act
    render(<AddressCard address={addressCardMock.address} />)

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Tornar principal' })
    ).not.toBeInTheDocument()
  })

  it('asks the store to edit this address', () => {
    // Arrange
    const startEditingAddress = vi.fn()
    facadeWith({ startEditingAddress })

    // Act
    render(<AddressCard address={addressCardMock.address} />)
    fireEvent.click(screen.getByRole('button', { name: 'Editar endereço' }))

    // Assert
    expect(startEditingAddress).toHaveBeenCalledWith(addressCardMock.address.id)
  })

  it('renders the form in place of the card while the store says editing', () => {
    // Arrange
    facadeWith({ editingAddressId: addressCardMock.address.id })

    // Act
    render(<AddressCard address={addressCardMock.address} />)

    // Assert
    expect(
      screen.getByRole('button', { name: 'Salvar endereço' })
    ).toBeInTheDocument()
    expect(screen.queryByText('Principal')).not.toBeInTheDocument()
  })

  it('asks the store to confirm delete for this address', () => {
    // Arrange
    const requestDeleteAddress = vi.fn()
    facadeWith({ requestDeleteAddress })

    // Act
    render(<AddressCard address={addressCardMock.address} />)
    fireEvent.click(screen.getByRole('button', { name: 'Excluir endereço' }))

    // Assert
    expect(requestDeleteAddress).toHaveBeenCalledWith(
      addressCardMock.address.id
    )
  })

  it('shows the confirmation row and deletes on confirm', () => {
    // Arrange
    const deleteAddress = vi.fn()
    facadeWith({
      confirmingDeleteAddressId: addressCardMock.address.id,
      deleteAddress,
    })

    // Act
    render(<AddressCard address={addressCardMock.address} />)
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(screen.getByText('Excluir este endereço?')).toBeInTheDocument()
    expect(deleteAddress).toHaveBeenCalledWith(
      addressCardMock.address.id,
      expect.any(Object)
    )
  })
})
