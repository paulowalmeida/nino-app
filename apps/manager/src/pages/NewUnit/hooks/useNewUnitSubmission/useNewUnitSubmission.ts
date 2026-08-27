import { useCallback } from 'react'

import { ApiError } from '@nino/lib/utils/api-error'
import { toCreateStoreRequest } from '@shared/adapters/first-store-form.adapter/first-store-form.adapter'
import { useCreateStore } from '@shared/hooks/store/useCreateStore/useCreateStore'
import type { FirstStoreFormValues } from 'src/shared/types/store/first-store-form-values'
import type { StoreSubmitResult } from 'src/shared/types/store/store-submit-result'

export const useNewUnitSubmission = () => {
  const { mutateAsync: createStore } = useCreateStore(
    ({ id }) => `/${id}/configuracoes/unidade`
  )

  const submitStore = useCallback(
    async (data: FirstStoreFormValues): Promise<StoreSubmitResult> => {
      try {
        await createStore(toCreateStoreRequest(data))
        return { status: 'success' }
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          return { status: 'slug-taken' }
        }

        if (!navigator.onLine) return { status: 'offline' }

        return { status: 'error' }
      }
    },
    [createStore]
  )

  return { submitStore }
}
