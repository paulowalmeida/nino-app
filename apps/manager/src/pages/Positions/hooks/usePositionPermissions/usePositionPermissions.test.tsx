import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PositionsService } from '@shared/services/positions/positions.service/positions.service'

import { usePositionPermissions } from './usePositionPermissions'
import {
  positionPermissionsCatalogMock,
  positionPermissionsUnitIdMock,
} from './usePositionPermissions.mock'

vi.mock('@shared/services/positions/positions.service/positions.service', () => ({
  PositionsService: { listPermissions: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

afterEach(() => vi.clearAllMocks())

describe(usePositionPermissions.name, () => {
  it('stays disabled without a unit id', () => {
    const { result } = renderHook(() => usePositionPermissions(null), {
      wrapper,
    })

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('loads the permission catalog of the unit', async () => {
    vi.mocked(PositionsService.listPermissions).mockResolvedValue(
      positionPermissionsCatalogMock
    )

    const { result } = renderHook(
      () => usePositionPermissions(positionPermissionsUnitIdMock),
      { wrapper }
    )

    await waitFor(() =>
      expect(result.current.data).toEqual(positionPermissionsCatalogMock)
    )
    expect(PositionsService.listPermissions).toHaveBeenCalledWith(
      positionPermissionsUnitIdMock
    )
  })
})
