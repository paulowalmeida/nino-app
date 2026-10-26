import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useSettings } from './useSettings'

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useSettings.name, () => {
  it('does not fetch settings without a unit', () => {
    const { result } = renderHook(() => useSettings(null), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
  })
})
