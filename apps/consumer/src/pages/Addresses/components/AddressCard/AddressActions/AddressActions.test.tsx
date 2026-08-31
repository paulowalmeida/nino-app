import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import { AddressActions } from './AddressActions'
import { addressActionsMock } from './AddressActions.mock'

vi.mock('@pages/Addresses/facades/useAddressesFacade/useAddressesFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAddressesFacade).mockReturnValue({
    startEditingAddress: vi.fn(),
    requestDeleteAddress: vi.fn(),
    saveAddress: vi.fn(),
    makeAddressPrimary: vi.fn(),
    isSavingAddress: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAddressesFacade>)

describe('AddressActions', () => {
  it('hides the primary action for the primary address', () => {
    facadeWith({})

    render(<AddressActions address={addressActionsMock.address} />)

    expect(
      screen.queryByRole('button', { name: 'Tornar principal' })
    ).not.toBeInTheDocument()
  })

  it('marks a secondary address as primary', () => {
    const makeAddressPrimary = vi.fn()
    facadeWith({ makeAddressPrimary })
    const address = { ...addressActionsMock.address, isPrimary: false }

    render(<AddressActions address={address} />)
    fireEvent.click(screen.getByRole('button', { name: 'Tornar principal' }))

    expect(makeAddressPrimary).toHaveBeenCalledWith(address)
  })

  it('blocks the primary action while the address is being saved', () => {
    facadeWith({ isSavingAddress: true })
    const address = { ...addressActionsMock.address, isPrimary: false }

    render(<AddressActions address={address} />)

    expect(
      screen.getByRole('button', { name: 'Tornar principal' })
    ).toBeDisabled()
  })

  it('starts editing this address', () => {
    const startEditingAddress = vi.fn()
    facadeWith({ startEditingAddress })

    render(<AddressActions address={addressActionsMock.address} />)
    fireEvent.click(screen.getByRole('button', { name: 'Editar endereço' }))

    expect(startEditingAddress).toHaveBeenCalledWith(
      addressActionsMock.address.id
    )
  })

  it('requests deletion for this address', () => {
    const requestDeleteAddress = vi.fn()
    facadeWith({ requestDeleteAddress })

    render(<AddressActions address={addressActionsMock.address} />)
    fireEvent.click(screen.getByRole('button', { name: 'Excluir endereço' }))

    expect(requestDeleteAddress).toHaveBeenCalledWith(
      addressActionsMock.address.id
    )
  })
})
