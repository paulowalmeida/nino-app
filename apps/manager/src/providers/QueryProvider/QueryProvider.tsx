import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@lib/query-client'

import type { QueryProviderProps } from './QueryProvider.types'

export const QueryProvider = ({ children }: QueryProviderProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
