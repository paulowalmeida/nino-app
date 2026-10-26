import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'

import { usePublicSettings } from './usePublicSettings'
import { usePublicSettingsMock } from './usePublicSettings.mock'

let queryOptions: { queryKey: unknown; enabled: boolean } | undefined
let queryData: unknown

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: typeof queryOptions) => {
    queryOptions = options
    return { data: queryData }
  },
}))

describe('usePublicSettings', () => {
  it('uses the unit cache key and stays disabled without a unit', () => {
    renderHook(() => usePublicSettings(undefined))

    expect(queryOptions?.queryKey).toEqual(queryKeys.settings.byUnit(''))
    expect(queryOptions?.enabled).toBe(false)
  })

  it('does not estimate time before settings are available', () => {
    queryData = undefined

    const { result } = renderHook(() => usePublicSettings('unit-1'))

    expect(result.current.settings).toBeUndefined()
    expect(result.current.estimatedMinutes).toBeUndefined()
  })

  it('sums preparation and delivery time from public settings', () => {
    queryData = usePublicSettingsMock.settings

    const { result } = renderHook(() => usePublicSettings('unit-1'))

    expect(result.current.estimatedMinutes).toBe(55)
  })
})
