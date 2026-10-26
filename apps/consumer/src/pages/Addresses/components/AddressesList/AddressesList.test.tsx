import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import { AddressesList } from './AddressesList'
import { addressesListMock } from './AddressesList.mock'

vi.mock('@pages/Addresses/facades/useAddressesFacade/useAddressesFacade')
vi.mock('@pages/Addresses/components/AddressCard/AddressCard', () => ({
  AddressCard: ({ address }: { address: { street: string } }) => (
    <span>{address.street}</span>
  ),
}))

describe('AddressesList', () => {
  it('renders every address exposed by the facade', () => {
    vi.mocked(useAddressesFacade).mockReturnValue({
      addresses: addressesListMock.addresses,
    } as unknown as ReturnType<typeof useAddressesFacade>)

    render(<AddressesList />)

    expect(screen.getByText('Rua das Flores')).toBeInTheDocument()
  })
})
