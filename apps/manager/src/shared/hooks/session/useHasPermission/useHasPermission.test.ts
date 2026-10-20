import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useHasPermission } from './useHasPermission'
import { permittedMembershipMock } from './useHasPermission.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')

afterEach(() => vi.resetAllMocks())

describe(useHasPermission.name, () => {
  it('grants a permission held by the current cargo', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(permittedMembershipMock)

    const { result } = renderHook(() => useHasPermission('catalog.manage'))

    expect(result.current).toBe(true)
  })

  it('denies a permission the current cargo lacks', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(permittedMembershipMock)

    const { result } = renderHook(() => useHasPermission('reports.view'))

    expect(result.current).toBe(false)
  })

  it('denies everything while no unit is selected', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)

    const { result } = renderHook(() => useHasPermission('catalog.manage'))

    expect(result.current).toBe(false)
  })
})
