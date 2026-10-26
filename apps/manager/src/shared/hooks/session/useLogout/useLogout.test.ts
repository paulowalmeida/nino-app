import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AuthService } from '@shared/services/auth/auth.service'
import { endSession } from '@shared/services/session/end-session'

import { useLogout } from './useLogout'

vi.mock('@shared/services/auth/auth.service', () => ({ AuthService: { logout: vi.fn() } }))
vi.mock('@shared/services/session/end-session', () => ({ endSession: vi.fn() }))

describe(useLogout.name, () => {
  it('always ends the local session after the remote attempt', async () => {
    vi.mocked(AuthService.logout).mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useLogout())
    await result.current.logout()
    expect(endSession).toHaveBeenCalledOnce()
  })
})
