import { toast } from '@nino/ds/components/Toast'
import { MutationCache, QueryClient } from '@tanstack/react-query'

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
