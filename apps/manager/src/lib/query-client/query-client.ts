import { MutationCache, QueryClient } from '@tanstack/react-query'

export type QueryMutationMeta = {
  silentError?: boolean
  errorTitle?: string
  success?: string
}

export type QueryClientMutationNotifications = {
  onError?: (meta: QueryMutationMeta | undefined) => void
  onSuccess?: (meta: QueryMutationMeta | undefined) => void
}

let mutationNotifications: QueryClientMutationNotifications = {}

export const configureQueryClientMutationNotifications = (
  next: QueryClientMutationNotifications
): void => {
  mutationNotifications = next
}

const readMutationMeta = (value: unknown): QueryMutationMeta | undefined => {
  if (!value || typeof value !== 'object') return undefined

  const meta = value as Record<string, unknown>

  return {
    ...(typeof meta.silentError === 'boolean' && {
      silentError: meta.silentError,
    }),
    ...(typeof meta.errorTitle === 'string' && { errorTitle: meta.errorTitle }),
    ...(typeof meta.success === 'string' && { success: meta.success }),
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (_error, _variables, _context, mutation) => {
      mutationNotifications.onError?.(readMutationMeta(mutation.meta))
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      mutationNotifications.onSuccess?.(readMutationMeta(mutation.meta))
    },
  }),
})
