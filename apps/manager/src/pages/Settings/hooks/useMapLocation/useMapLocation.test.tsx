import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UnitService } from '@shared/services/unit/unit.service'

import { useMapLocation } from './useMapLocation'
import { mapLocationMock, mapLocationUnitIdMock } from './useMapLocation.mock'

vi.mock('@shared/services/unit/unit.service', () => ({
  UnitService: { getMapLocation: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('useMapLocation', () => {
  beforeEach(() => {
    vi.mocked(UnitService.getMapLocation).mockReset()
  })

  it('resolves the unit coordinates', async () => {
    vi.mocked(UnitService.getMapLocation).mockResolvedValue(mapLocationMock)

    const { result } = renderHook(() => useMapLocation(mapLocationUnitIdMock), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isResolved).toBe(true))
    expect(result.current.coordinates).toEqual(mapLocationMock)
    expect(result.current.hasLocation).toBe(true)
  })

  it('resolves without coordinates when the unit has no address', async () => {
    vi.mocked(UnitService.getMapLocation).mockResolvedValue(null)

    const { result } = renderHook(() => useMapLocation(mapLocationUnitIdMock), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isResolved).toBe(true))
    expect(result.current.hasLocation).toBe(false)
  })

  it('stays unresolved while there is no unit', () => {
    const { result } = renderHook(() => useMapLocation(null), { wrapper })

    expect(result.current.isResolved).toBe(false)
    expect(UnitService.getMapLocation).not.toHaveBeenCalled()
  })
})
