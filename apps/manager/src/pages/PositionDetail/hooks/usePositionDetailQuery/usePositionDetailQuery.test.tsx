import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUnitPositions } from '@shared/hooks/team/useUnitPositions/useUnitPositions'

import { usePositionDetailQuery } from './usePositionDetailQuery'
import { positionDetailQueryPositionsMock } from './usePositionDetailQuery.mock'

vi.mock('@shared/hooks/team/useUnitPositions/useUnitPositions')

describe(usePositionDetailQuery.name, () => {
  beforeEach(() => {
    vi.mocked(useUnitPositions).mockReturnValue({
      data: positionDetailQueryPositionsMock,
      isPending: false,
      isError: false,
    } as never)
  })

  it('picks the cargo addressed by the route', () => {
    const { result } = renderHook(() =>
      usePositionDetailQuery('unit-1', 'position-staff')
    )

    expect(useUnitPositions).toHaveBeenCalledWith('unit-1')
    expect(result.current.position?.name).toBe('Atendente')
    expect(result.current.isPending).toBe(false)
  })

  it('finds nothing for an unknown or absent id', () => {
    const unknown = renderHook(() =>
      usePositionDetailQuery('unit-1', 'ghost')
    )
    const absent = renderHook(() =>
      usePositionDetailQuery('unit-1', undefined)
    )

    expect(unknown.result.current.position).toBeUndefined()
    expect(absent.result.current.position).toBeUndefined()
  })

  it('reports loading and failure from the list query', () => {
    vi.mocked(useUnitPositions).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: true,
    } as never)

    const { result } = renderHook(() =>
      usePositionDetailQuery(null, 'position-staff')
    )

    expect(result.current).toEqual({
      position: undefined,
      isPending: true,
      isError: true,
    })
  })
})
