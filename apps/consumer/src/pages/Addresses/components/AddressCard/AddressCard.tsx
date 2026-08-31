import type { Address } from '@custom_types/address/address'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import { AddressForm } from '../AddressForm/AddressForm'
import { AddressActions } from './AddressActions/AddressActions'
import { AddressDeleteConfirmation } from './AddressDeleteConfirmation/AddressDeleteConfirmation'
import { AddressSummary } from './AddressSummary/AddressSummary'

type AddressCardProps = {
  address: Address
}

export const AddressCard = ({ address }: AddressCardProps) => {
  const { editingAddressId, cancelEditingAddress } = useAddressesFacade()

  if (editingAddressId === address.id) {
    return (
      <AddressForm
        address={address}
        onCancel={cancelEditingAddress}
        onDone={cancelEditingAddress}
      />
    )
  }

  return (
    <>
      <AddressSummary address={address} />
      <AddressActions address={address} />
      <AddressDeleteConfirmation addressId={address.id} />
    </>
  )
}
