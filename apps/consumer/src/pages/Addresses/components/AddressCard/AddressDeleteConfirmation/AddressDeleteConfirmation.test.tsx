import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { toast } from '@nino/ds/components/Toast'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import { AddressDeleteConfirmation } from './AddressDeleteConfirmation'
import { addressDeleteConfirmationMock } from './AddressDeleteConfirmation.mock'

vi.mock('@pages/Addresses/facades/useAddressesFacade/useAddressesFacade')
vi.mock('@nino/ds/components/Toast')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAddressesFacade).mockReturnValue({
    confirmingDeleteAddressId: addressDeleteConfirmationMock.addressId,
    cancelDeleteAddress: vi.fn(),
    deleteAddress: vi.fn(),
    isDeletingAddress: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAddressesFacade>)

describe('AddressDeleteConfirmation', () => {
  it('stays hidden when another address is awaiting confirmation', () => {
    facadeWith({ confirmingDeleteAddressId: 'another-address' })

    render(
      <AddressDeleteConfirmation
        addressId={addressDeleteConfirmationMock.addressId}
      />
    )

    expect(screen.queryByText('Excluir este endereço?')).not.toBeInTheDocument()
  })

  it('deletes the address after confirmation', () => {
    const deleteAddress = vi.fn()
    facadeWith({ deleteAddress })

    render(
      <AddressDeleteConfirmation
        addressId={addressDeleteConfirmationMock.addressId}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(deleteAddress).toHaveBeenCalledWith(
      addressDeleteConfirmationMock.addressId,
      expect.any(Object)
    )
  })

  it('closes confirmation and reports a successful deletion', () => {
    const cancelDeleteAddress = vi.fn()
    const deleteAddress = vi.fn(
      (_id: string, options: { onSuccess: () => void }) => options.onSuccess()
    )
    facadeWith({ cancelDeleteAddress, deleteAddress })

    render(
      <AddressDeleteConfirmation
        addressId={addressDeleteConfirmationMock.addressId}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(cancelDeleteAddress).toHaveBeenCalledOnce()
    expect(toast.success).toHaveBeenCalledWith('Endereço excluído.')
  })

  it('reports a deletion failure without closing confirmation', () => {
    const cancelDeleteAddress = vi.fn()
    const deleteAddress = vi.fn(
      (_id: string, options: { onError: () => void }) => options.onError()
    )
    facadeWith({ cancelDeleteAddress, deleteAddress })

    render(
      <AddressDeleteConfirmation
        addressId={addressDeleteConfirmationMock.addressId}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(cancelDeleteAddress).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('Não deu para excluir agora.')
  })

  it('cancels the confirmation', () => {
    const cancelDeleteAddress = vi.fn()
    facadeWith({ cancelDeleteAddress })

    render(
      <AddressDeleteConfirmation
        addressId={addressDeleteConfirmationMock.addressId}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Manter' }))

    expect(cancelDeleteAddress).toHaveBeenCalledOnce()
  })

  it('blocks deletion while it is pending', () => {
    facadeWith({ isDeletingAddress: true })

    render(
      <AddressDeleteConfirmation
        addressId={addressDeleteConfirmationMock.addressId}
      />
    )

    expect(screen.getByRole('button', { name: 'Excluindo…' })).toBeDisabled()
  })
})
