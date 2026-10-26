import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useOpeningHours } from './useOpeningHours'
import { openingHoursHookUnitIdMock } from './useOpeningHours.mock'

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useOpeningHours.name, () => {
  it('stays disabled until a unit is selected', () => {
    const { result } = renderHook(() => useOpeningHours(null), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('returns a stable empty list before the response arrives', () => {
    const { result } = renderHook(() => useOpeningHours(openingHoursHookUnitIdMock), { wrapper })
    expect(result.current.hours).toEqual([])
  })
})
