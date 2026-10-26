import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useLogout } from '@shared/hooks/useLogout/useLogout'
import { useAccountNavigationFacade } from './useAccountNavigationFacade'
import { useAccountNavigationFacadeMock } from './useAccountNavigationFacade.mock'

vi.mock('@shared/hooks/useLogout/useLogout')

describe('useAccountNavigationFacade', () => {
  it('exposes only the logout command and its state', () => {
    const logout = vi.fn()
    vi.mocked(useLogout).mockReturnValue({
      mutate: logout,
      isPending: useAccountNavigationFacadeMock.isLoggingOut,
    } as never)

    const { result } = renderHook(() => useAccountNavigationFacade())

    expect(result.current).toEqual({
      logout,
      isLoggingOut: false,
    })
  })
})
