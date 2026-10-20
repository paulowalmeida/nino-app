import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PositionsService } from '@shared/services/positions/positions.service/positions.service'

import { useUnitPositions } from './useUnitPositions'
import {
  unitPositionsHookMock,
  unitPositionsHookUnitIdMock,
} from './useUnitPositions.mock'

vi.mock('@shared/services/positions/positions.service/positions.service', () => ({
  PositionsService: { list: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

afterEach(() => vi.clearAllMocks())

describe(useUnitPositions.name, () => {
  it('stays disabled without a unit id', () => {
    const { result } = renderHook(() => useUnitPositions(null), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('stays disabled when the caller opts out', () => {
    const { result } = renderHook(
      () => useUnitPositions(unitPositionsHookUnitIdMock, false),
      { wrapper }
    )

    expect(result.current.fetchStatus).toBe('idle')
    expect(PositionsService.list).not.toHaveBeenCalled()
  })

  it('loads the cargos of the unit', async () => {
    vi.mocked(PositionsService.list).mockResolvedValue(unitPositionsHookMock)

    const { result } = renderHook(
      () => useUnitPositions(unitPositionsHookUnitIdMock),
      { wrapper }
    )

    await waitFor(() => expect(result.current.data).toEqual(unitPositionsHookMock))
    expect(PositionsService.list).toHaveBeenCalledWith(
      unitPositionsHookUnitIdMock
    )
  })
})
