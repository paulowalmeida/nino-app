import { Box } from '@nino/ds/components/Box'
import { AddressCreation } from '@pages/Addresses/components/AddressCreation/AddressCreation'
import { AddressesEmptyState } from '@pages/Addresses/components/AddressesEmptyState/AddressesEmptyState'
import { AddressesHeader } from '@pages/Addresses/components/AddressesHeader/AddressesHeader'
import { AddressesList } from '@pages/Addresses/components/AddressesList/AddressesList'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'
import { AddressesSkeleton } from '@pages/Addresses/skeletons/AddressesSkeleton/AddressesSkeleton'

const NEW = 'new'

export const Addresses = () => {
  const { addresses, isAddressesPending, editingAddressId } =
    useAddressesFacade()

  return (
    <Box>
      <AddressesHeader />

      {isAddressesPending ? (
        <AddressesSkeleton />
      ) : (
        <>
          {addresses?.length === 0 && editingAddressId !== NEW && (
            <AddressesEmptyState />
          )}

          <AddressesList />
          <AddressCreation />
        </>
      )}
    </Box>
  )
}
