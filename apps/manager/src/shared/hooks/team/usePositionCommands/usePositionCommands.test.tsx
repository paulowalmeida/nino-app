import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PositionsService } from '@shared/services/positions/positions.service/positions.service'

import { usePositionCommands } from './usePositionCommands'
import {
  positionCommandsDraftMock,
  positionCommandsPositionIdMock,
  positionCommandsUnitIdMock,
} from './usePositionCommands.mock'

vi.mock(
  '@shared/services/positions/positions.service/positions.service',
  () => ({
    PositionsService: {
      create: vi.fn(),
      update: vi.fn(),
      duplicate: vi.fn(),
      remove: vi.fn(),
    },
  })
)

const queryClient = new QueryClient()
const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children)

afterEach(() => vi.clearAllMocks())

const renderCommands = (unitId: string | null = positionCommandsUnitIdMock) =>
  renderHook(() => usePositionCommands(unitId), { wrapper })

describe(usePositionCommands.name, () => {
  it('creates a cargo and refreshes the cargos and the team', async () => {
    vi.mocked(PositionsService.create).mockResolvedValue({} as never)
    const { result } = renderCommands()

    await act(() =>
      result.current.create.mutateAsync(positionCommandsDraftMock)
    )

    expect(PositionsService.create).toHaveBeenCalledWith(
      positionCommandsUnitIdMock,
      positionCommandsDraftMock
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.positions.all(positionCommandsUnitIdMock),
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.team.all(positionCommandsUnitIdMock),
    })
  })

  it('updates a cargo', async () => {
    vi.mocked(PositionsService.update).mockResolvedValue({} as never)
    const { result } = renderCommands()

    await act(() =>
      result.current.update.mutateAsync({
        positionId: positionCommandsPositionIdMock,
        draft: positionCommandsDraftMock,
      })
    )

    expect(PositionsService.update).toHaveBeenCalledWith(
      positionCommandsUnitIdMock,
      positionCommandsPositionIdMock,
      positionCommandsDraftMock
    )
  })

  it('duplicates a cargo', async () => {
    vi.mocked(PositionsService.duplicate).mockResolvedValue({} as never)
    const { result } = renderCommands()

    await act(() =>
      result.current.duplicate.mutateAsync(positionCommandsPositionIdMock)
    )

    expect(PositionsService.duplicate).toHaveBeenCalledWith(
      positionCommandsUnitIdMock,
      positionCommandsPositionIdMock
    )
  })

  it('removes a cargo', async () => {
    vi.mocked(PositionsService.remove).mockResolvedValue({
      message: 'ok',
    })
    const { result } = renderCommands()

    await act(() =>
      result.current.remove.mutateAsync(positionCommandsPositionIdMock)
    )

    expect(PositionsService.remove).toHaveBeenCalledWith(
      positionCommandsUnitIdMock,
      positionCommandsPositionIdMock
    )
  })

  it('scopes the refresh to an empty unit when none is selected', async () => {
    vi.mocked(PositionsService.remove).mockResolvedValue({ message: 'ok' })
    const { result } = renderCommands(null)

    await act(() =>
      result.current.remove.mutateAsync(positionCommandsPositionIdMock)
    )

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.positions.all(''),
    })
  })
})
