import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useTabPermissions } from './useTabPermissions'
import { tabPermissionsMock } from './useTabPermissions.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')

const mockRole = (role: string | undefined) =>
  vi
    .mocked(useCurrentUnit)
    .mockReturnValue(
      (role ? { role } : null) as unknown as ReturnType<typeof useCurrentUnit>
    )

describe('useTabPermissions', () => {
  it.each(tabPermissionsMock.managerRoles)('lets %s cancel a tab', (role) => {
    mockRole(role)

    const { result } = renderHook(() => useTabPermissions())

    expect(result.current.canCancelTab).toBe(true)
  })

  it('keeps the operator from cancelling a tab', () => {
    mockRole(tabPermissionsMock.operatorRole)

    const { result } = renderHook(() => useTabPermissions())

    expect(result.current.canCancelTab).toBe(false)
  })

  it('denies cancelling when no unit is selected', () => {
    mockRole(undefined)

    const { result } = renderHook(() => useTabPermissions())

    expect(result.current.canCancelTab).toBe(false)
  })
})
