import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import type { CreatedStore, CreateStoreRequest } from '@custom_types/store'
import { TenantService } from '@services/tenant.service'
import { useSessionStore } from '@states/useSessionStore'

/**
 * Same bootstrap rule as `useSignup`: the root route re-reads the session and
 * routes to the freshly created store. The session is cleared first because
 * `useSessionStore`'s `load` short-circuits on the user already in memory —
 * keeping it would send the root loader back here with the same empty
 * membership list.
 */
export const useCreateStore = (
  onCreated?: (store: CreatedStore) => string
) => {
  const navigate = useNavigate()

  return useMutation<CreatedStore, Error, CreateStoreRequest>({
    /* The form handles 409, offline and generic error inline. */
    meta: { silentError: true },
    mutationFn: TenantService.createStore,
    onSuccess: (store) => {
      useSessionStore.getState().clear()
      void navigate(onCreated?.(store) ?? '/')
    },
  })
}
