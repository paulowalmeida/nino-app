import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import type { CreatedStore, CreateStoreRequest } from '@custom_types/store'
import { createStore } from '@services/store/store.service'
import { useSessionStore } from '@states/useSessionStore'

/**
 * Same bootstrap rule as `useSignup`: the root route re-reads the session and
 * routes to the freshly created store. The session is cleared first because
 * `loadSession` short-circuits on the user already in memory — keeping it would
 * send the root loader back here with the same empty membership list.
 */
export const useCreateStore = (onCreated?: (store: CreatedStore) => string) => {
  const navigate = useNavigate()

  return useMutation<CreatedStore, Error, CreateStoreRequest>({
    /* O formulário trata 409, offline e erro genérico inline. */
    meta: { silentError: true },
    mutationFn: createStore,
    onSuccess: (store) => {
      useSessionStore.getState().clear()
      void navigate(onCreated?.(store) ?? '/')
    },
  })
}
