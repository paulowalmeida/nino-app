import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useStaff } from './useStaff'
import { staffHookUnitIdMock } from './useStaff.mock'

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useStaff.name, () => {
  it('stays disabled without a unit id', () => {
    const { result } = renderHook(() => useStaff(null), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(staffHookUnitIdMock).toBe('unit-1')
  })
})
