import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import { UnitService } from '@shared/services/unit/unit.service'
import { useSessionStore } from '@shared/states/session/session.state'
import type { CreateStoreRequest } from '@shared/types/store/create-store-request'
import type { CreatedStore } from '@shared/types/store/created-store'

/**
 * Same bootstrap rule as `useSignup`: the root route re-reads the session and
 * routes to the freshly created store. The session is cleared first because
 * `useSessionStore`'s `load` short-circuits on the user already in memory —
 * keeping it would send the root loader back here with the same empty
 * membership list.
 */
export const useCreateStore = (onCreated?: (store: CreatedStore) => string) => {
  const navigate = useNavigate()

  return useMutation<CreatedStore, Error, CreateStoreRequest>({
    /* The form handles 409, offline and generic error inline. */
    meta: { silentError: true },
    mutationFn: UnitService.createStore,
    onSuccess: (store) => {
      useSessionStore.getState().clear()
      void navigate(onCreated?.(store) ?? '/')
    },
  })
}
