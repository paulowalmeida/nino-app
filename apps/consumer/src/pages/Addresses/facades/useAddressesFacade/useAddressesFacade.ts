import { useParams } from 'react-router'

import { useDeleteAddress } from '@pages/Addresses/hooks/useDeleteAddress/useDeleteAddress'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'
import { useStore } from '@shared/hooks/useStore/useStore'
import { resolveSlug } from '@utils/resolve-slug'
import { useSaveAddress } from '@pages/Addresses/hooks/useSaveAddress/useSaveAddress'
import { useAddressesStore } from '@pages/Addresses/states/addresses/addresses.store'

export const useAddressesFacade = () => {
  const addresses = useMyAddresses(true)
  const saveAddress = useSaveAddress()
  const deleteAddress = useDeleteAddress()
  const { slug: pathSlug } = useParams()
  const { store } = useStore(resolveSlug(pathSlug) ?? undefined)
  const editingAddressId = useAddressesStore((state) => state.editingId)
  const startEditingAddress = useAddressesStore((state) => state.startEditing)
  const cancelEditingAddress = useAddressesStore((state) => state.cancelEditing)
  const confirmingDeleteAddressId = useAddressesStore(
    (state) => state.confirmingDeleteId
  )
  const requestDeleteAddress = useAddressesStore((state) => state.requestDelete)
  const cancelDeleteAddress = useAddressesStore((state) => state.cancelDelete)

  return {
    addresses: addresses.data,
    isAddressesPending: addresses.isPending,
    saveAddress: saveAddress.mutate,
    isSavingAddress: saveAddress.isPending,
    makeAddressPrimary: saveAddress.makePrimary,
    hasSaveAddressError: saveAddress.isError,
    deleteAddress: deleteAddress.mutate,
    isDeletingAddress: deleteAddress.isPending,
    storeId: store?.id,
    storeState: store?.state,
    editingAddressId,
    startEditingAddress,
    cancelEditingAddress,
    confirmingDeleteAddressId,
    requestDeleteAddress,
    cancelDeleteAddress,
  }
}
