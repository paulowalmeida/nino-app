import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useTabPermissions } from './useTabPermissions'
import {
  tabCancellerMembershipMock,
  tabOperatorMembershipMock,
} from './useTabPermissions.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')

describe('useTabPermissions', () => {
  it('lets a cargo with tabs.cancel cancel a tab', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(tabCancellerMembershipMock)

    const { result } = renderHook(() => useTabPermissions())

    expect(result.current.canCancelTab).toBe(true)
  })

  it('keeps the operator from cancelling a tab', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(tabOperatorMembershipMock)

    const { result } = renderHook(() => useTabPermissions())

    expect(result.current.canCancelTab).toBe(false)
  })

  it('denies cancelling when no unit is selected', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)

    const { result } = renderHook(() => useTabPermissions())

    expect(result.current.canCancelTab).toBe(false)
  })
})
