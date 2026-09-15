import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useStoreTypes } from './useStoreTypes'
import { storeTypesQueryKeyMock } from './useStoreTypes.mock'

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useStoreTypes.name, () => {
  it('uses the immutable store-types query key', () => {
    const { result } = renderHook(() => useStoreTypes(), { wrapper })
    expect(result.current.data).toBeUndefined()
    expect(storeTypesQueryKeyMock).toEqual(['store-types'])
  })
})
