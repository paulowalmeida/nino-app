import type { ReactNode } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@lib/query-client'

type QueryProviderProps = {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
