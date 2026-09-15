import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCouriers } from './useCouriers'
import { couriersHookUnitIdMock } from './useCouriers.mock'

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useCouriers.name, () => {
  it('stays disabled without a unit id', () => {
    const { result } = renderHook(() => useCouriers(null), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(couriersHookUnitIdMock).toBe('unit-1')
  })
})
