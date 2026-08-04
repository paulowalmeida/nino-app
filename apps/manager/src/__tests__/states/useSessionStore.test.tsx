import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthService } from '@services/auth.service'
import { useSessionStore } from '@states/useSessionStore'
import { forgetSession, rememberSession } from '@utils/session-hint'

import { authUser, memberships } from './useSessionStore.mock'

vi.mock('@services/auth.service')
vi.mock('@utils/session-hint')

describe(useSessionStore.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSessionStore.getState().clear()
  })

  it('sets user, memberships and current tenant', () => {
    // Arrange / Act
    act(() => {
      useSessionStore.getState().setSession(authUser, memberships)
      useSessionStore.getState().setCurrentTenant('tenant-1')
    })

    // Assert
    expect(useSessionStore.getState().user).toEqual(authUser)
    expect(useSessionStore.getState().memberships).toEqual(memberships)
    expect(useSessionStore.getState().currentTenantId).toBe('tenant-1')
  })

  it('resets to the empty state on clear', () => {
    // Arrange
    act(() => {
      useSessionStore.getState().setSession(authUser, memberships)
      useSessionStore.getState().setCurrentTenant('tenant-1')
    })

    // Act
    act(() => useSessionStore.getState().clear())

    // Assert
    expect(useSessionStore.getState().user).toBeNull()
    expect(useSessionStore.getState().memberships).toEqual([])
    expect(useSessionStore.getState().currentTenantId).toBeNull()
  })

  it('returns the cached user without calling the API when already set', async () => {
    // Arrange
    act(() => useSessionStore.getState().setSession(authUser, memberships))

    // Act
    const result = await useSessionStore.getState().load()

    // Assert
    expect(result).toEqual(authUser)
    expect(AuthService.me).not.toHaveBeenCalled()
  })

  it('fetches and stores the session, remembering it on success', async () => {
    // Arrange
    vi.mocked(AuthService.me).mockResolvedValue({ ...authUser, memberships })

    // Act
    const result = await useSessionStore.getState().load()

    // Assert
    expect(result).toEqual(authUser)
    expect(useSessionStore.getState().memberships).toEqual(memberships)
    expect(rememberSession).toHaveBeenCalled()
  })

  it('clears the hint and returns null when the fetch fails', async () => {
    // Arrange
    vi.mocked(AuthService.me).mockRejectedValue(new Error('unauthorized'))

    // Act
    const result = await useSessionStore.getState().load()

    // Assert
    expect(result).toBeNull()
    expect(forgetSession).toHaveBeenCalled()
  })
})
