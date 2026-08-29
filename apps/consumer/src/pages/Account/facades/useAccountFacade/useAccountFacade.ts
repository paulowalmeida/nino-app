import { useCompleteProfile } from '@pages/account/hooks/useCompleteProfile/useCompleteProfile'
import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useDeleteAddress } from '@pages/account/hooks/useDeleteAddress/useDeleteAddress'
import { useLogout } from '@shared/hooks/useLogout/useLogout'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'
import { useMyOrders } from '@shared/hooks/useMyOrders/useMyOrders'
import { useSaveAddress } from '@pages/account/hooks/useSaveAddress/useSaveAddress'
import { useAddressesStore } from '@pages/account/states/addresses/addresses.store'
import { useStoreTint } from '@shared/hooks/useStoreTint/useStoreTint'

export const useAccountFacade = () => {
  const { customer, isPending: isSessionPending } = useCustomerSession()
  const tint = useStoreTint()

  const orders = useMyOrders(!!customer)
  const addresses = useMyAddresses(!!customer)

  const logout = useLogout()
  const saveAddress = useSaveAddress()
  const deleteAddress = useDeleteAddress()
  const completeProfile = useCompleteProfile()

  const addressesUi = useAddressesStore()

  return {
    customer,
    isSessionPending,
    tint,

    orders: orders.data,
    isOrdersPending: orders.isPending,

    addresses: addresses.data,
    isAddressesPending: addresses.isPending,

    logout: logout.mutate,
    isLoggingOut: logout.isPending,

    saveAddress: saveAddress.mutate,
    isSavingAddress: saveAddress.isPending,
    hasSaveAddressError: saveAddress.isError,

    deleteAddress: deleteAddress.mutate,
    isDeletingAddress: deleteAddress.isPending,

    completeProfile: completeProfile.mutate,
    isCompletingProfile: completeProfile.isPending,

    editingAddressId: addressesUi.editingId,
    startEditingAddress: addressesUi.startEditing,
    cancelEditingAddress: addressesUi.cancelEditing,

    confirmingDeleteAddressId: addressesUi.confirmingDeleteId,
    requestDeleteAddress: addressesUi.requestDelete,
    cancelDeleteAddress: addressesUi.cancelDelete,
  }
}
