import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'

import {
  configureQueryClientMutationNotifications,
  queryClient,
} from '@lib/query-client/query-client'
import { toast } from '@nino/ds/components/Toast'

type QueryProviderProps = {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  useEffect(() => {
    configureQueryClientMutationNotifications({
      onError: (meta) => {
        if (meta?.silentError) return

        toast.error(
          meta?.errorTitle ?? 'Não deu pra salvar',
          'Tente de novo em instantes.'
        )
      },
      onSuccess: (meta) => {
        if (meta?.success) toast.success(meta.success)
      },
    })

    return () => configureQueryClientMutationNotifications({})
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
