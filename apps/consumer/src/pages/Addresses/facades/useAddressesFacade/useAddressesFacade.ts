import { useDeleteAddress } from '@pages/Addresses/hooks/useDeleteAddress/useDeleteAddress'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'
import { useSaveAddress } from '@pages/Addresses/hooks/useSaveAddress/useSaveAddress'
import { useAddressesStore } from '@pages/Addresses/states/addresses/addresses.store'

export const useAddressesFacade = () => {
  const addresses = useMyAddresses(true)
  const saveAddress = useSaveAddress()
  const deleteAddress = useDeleteAddress()
  const addressesUi = useAddressesStore()

  return {
    addresses: addresses.data,
    isAddressesPending: addresses.isPending,
    saveAddress: saveAddress.mutate,
    isSavingAddress: saveAddress.isPending,
    hasSaveAddressError: saveAddress.isError,
    deleteAddress: deleteAddress.mutate,
    isDeletingAddress: deleteAddress.isPending,
    editingAddressId: addressesUi.editingId,
    startEditingAddress: addressesUi.startEditing,
    cancelEditingAddress: addressesUi.cancelEditing,
    confirmingDeleteAddressId: addressesUi.confirmingDeleteId,
    requestDeleteAddress: addressesUi.requestDelete,
    cancelDeleteAddress: addressesUi.cancelDelete,
  }
}
