import { MutationCache, QueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'

type QueryMutationMeta = {
  silentError?: boolean
  errorTitle?: string
  success?: string
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
      const meta = mutation.meta as QueryMutationMeta | undefined

      if (meta?.silentError) return
      toast.error(
        meta?.errorTitle ?? 'Não deu pra salvar',
        'Tente de novo em instantes.'
      )
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      const success = (mutation.meta as QueryMutationMeta | undefined)?.success

      if (success) toast.success(success)
    },
  }),
})
