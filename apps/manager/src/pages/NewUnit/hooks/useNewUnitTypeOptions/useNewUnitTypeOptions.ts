import { toNewUnitTypeOptions } from '@pages/NewUnit/adapters/newUnitTypeOptions.adapter/newUnitTypeOptions.adapter'
import { useStoreTypes } from '@shared/hooks/store/useStoreTypes/useStoreTypes'

export const useNewUnitTypeOptions = () => {
  const storeTypes = useStoreTypes()

  return {
    typeOptions: toNewUnitTypeOptions(storeTypes.data ?? []),
    isPending: storeTypes.isPending,
  }
}
