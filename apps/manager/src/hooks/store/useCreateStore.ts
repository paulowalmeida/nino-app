import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import type { CreatedStore, CreateStoreRequest } from '@custom_types/store'
import { createStore } from '@services/store/store.service'

/**
 * Same bootstrap rule as `useSignup`: the root route re-reads the session and
 * routes to the freshly created store.
 */
export const useCreateStore = () => {
  const navigate = useNavigate()

  return useMutation<CreatedStore, Error, CreateStoreRequest>({
    mutationFn: createStore,
    onSuccess: () => {
      void navigate('/')
    },
  })
}
