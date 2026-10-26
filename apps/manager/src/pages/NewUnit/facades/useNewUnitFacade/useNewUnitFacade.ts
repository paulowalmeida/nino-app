import { useNewUnitSubmission } from '@pages/NewUnit/hooks/useNewUnitSubmission/useNewUnitSubmission'
import { useNewUnitTypeOptions } from '@pages/NewUnit/hooks/useNewUnitTypeOptions/useNewUnitTypeOptions'

export const useNewUnitFacade = () => {
  const typeOptions = useNewUnitTypeOptions()
  const submission = useNewUnitSubmission()

  return {
    typeOptions: typeOptions.typeOptions,
    submitStore: submission.submitStore,
    isStoreTypesPending: typeOptions.isPending,
  }
}
