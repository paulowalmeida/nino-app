import { toast } from '@nino/ds/components/Toast'
import { MutationCache, QueryClient } from '@tanstack/react-query'

/**
 * Every write goes through here, so failure is announced by default instead of
 * per hook: forgetting an `onError` used to mean the action failed in total
 * silence. Success is opt-in via `meta.success` because only the hook knows
 * what to call the thing that was saved.
 */
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
      if (mutation.meta?.silentError) return
      toast.error(
        mutation.meta?.errorTitle ?? 'Não deu pra salvar',
        'Tente de novo em instantes.'
      )
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.success) toast.success(mutation.meta.success)
    },
  }),
})
