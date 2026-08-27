import { useCallback } from 'react'

import { ApiError } from '@nino/lib/utils/api-error'
import { toUnitsStoreTypeOptions } from '@pages/Units/adapters/toUnitsStoreTypeOptions/toUnitsStoreTypeOptions'
import { toCreateStoreRequest } from '@shared/adapters/first-store-form.adapter/first-store-form.adapter'
import { useCreateStore } from '@shared/hooks/store/useCreateStore/useCreateStore'
import { useStoreTypes } from '@shared/hooks/store/useStoreTypes/useStoreTypes'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'
import type { StoreSubmitResult } from '@shared/types/store/store-submit-result'

export const useUnitsStoreForm = () => {
  const { data: types = [] } = useStoreTypes()
  const { mutateAsync: createStore } = useCreateStore()

  const submitStore = useCallback(async (data: FirstStoreFormValues): Promise<StoreSubmitResult> => {
    try {
      await createStore(toCreateStoreRequest(data))
      return { status: 'success' }
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) return { status: 'slug-taken' }
      if (!navigator.onLine) return { status: 'offline' }
      return { status: 'error' }
    }
  }, [createStore])

  return { typeOptions: toUnitsStoreTypeOptions(types), submitStore }
}
