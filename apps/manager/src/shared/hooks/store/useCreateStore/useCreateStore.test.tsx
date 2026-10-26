import { MemoryRouter } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCreateStore } from './useCreateStore'
import { createStoreHookUnitIdMock } from './useCreateStore.mock'

describe(useCreateStore.name, () => {
  it('starts idle and accepts an optional post-create route', () => {
    const { result } = renderHook(() => useCreateStore(() => `/${createStoreHookUnitIdMock}`), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            {children}
          </QueryClientProvider>
        </MemoryRouter>
      ),
    })
    expect(result.current.isPending).toBe(false)
  })
})
