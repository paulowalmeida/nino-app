import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useTenantRole } from '@hooks/session/useTenantRole'
import { useSessionStore } from '@states/useSessionStore'

import { currentMembership } from './useCurrentTenant.mock'

describe(useTenantRole.name, () => {
  afterEach(() => {
    useSessionStore.setState({ memberships: [], currentTenantId: null })
  })

  it('returns the role held in the current tenant', () => {
    // Arrange
    useSessionStore.setState({
      memberships: [currentMembership],
      currentTenantId: 'tenant-1',
    })

    // Act
    const { result } = renderHook(() => useTenantRole())

    // Assert
    expect(result.current).toBe('MANAGER')
  })

  it('returns null with no current tenant', () => {
    // Arrange / Act
    const { result } = renderHook(() => useTenantRole())

    // Assert
    expect(result.current).toBeNull()
  })
})
