import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  useAccountFacade,
} from '@pages/account/facades/useAccountFacade/useAccountFacade'

import { Addresses } from './Addresses'
import { addressesMock } from './Addresses.mock'

vi.mock('@pages/account/facades/useAccountFacade/useAccountFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAccountFacade).mockReturnValue({
    addresses: [],
    isAddressesPending: false,
    saveAddress: vi.fn(),
    isSavingAddress: false,
    hasSaveAddressError: false,
    deleteAddress: vi.fn(),
    isDeletingAddress: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAccountFacade>)

describe('Addresses', () => {
  it('shows the empty state when there is no address saved', () => {
    // Arrange
    facadeWith({ addresses: [] })

    // Act
    render(<Addresses />)

    // Assert
    expect(
      screen.getByText(/Você ainda não salvou nenhum endereço/)
    ).toBeInTheDocument()
  })

  it('lists each saved address', () => {
    // Arrange
    facadeWith({ addresses: addressesMock.addresses })

    // Act
    render(<Addresses />)

    // Assert
    expect(screen.getByText(/Rua das Flores, 123/)).toBeInTheDocument()
  })

  it('opens the new address form and hides the add button', () => {
    // Arrange
    facadeWith({ addresses: [] })

    // Act
    render(<Addresses />)
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar endereço' }))

    // Assert
    expect(screen.getByText('Novo endereço')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Adicionar endereço' })
    ).not.toBeInTheDocument()
  })

  it('sets an address as primary through the facade command', () => {
    // Arrange
    const saveAddress = vi.fn()
    facadeWith({ addresses: addressesMock.secondaryAddresses, saveAddress })

    // Act
    render(<Addresses />)
    fireEvent.click(screen.getByRole('button', { name: 'Tornar principal' }))

    // Assert
    expect(saveAddress).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'address-2' })
    )
  })
})
