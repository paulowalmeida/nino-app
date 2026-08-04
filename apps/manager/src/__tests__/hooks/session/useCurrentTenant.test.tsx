import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSessionStore } from '@states/useSessionStore'

import { currentMembership, otherMembership } from './useCurrentTenant.mock'

describe(useCurrentTenant.name, () => {
  afterEach(() => {
    useSessionStore.setState({ memberships: [], currentTenantId: null })
  })

  it('returns the membership matching the current tenant', () => {
    // Arrange
    useSessionStore.setState({
      memberships: [currentMembership, otherMembership],
      currentTenantId: 'tenant-1',
    })

    // Act
    const { result } = renderHook(() => useCurrentTenant())

    // Assert
    expect(result.current).toEqual(currentMembership)
  })

  it('returns null when the current tenant has no membership', () => {
    // Arrange
    useSessionStore.setState({
      memberships: [otherMembership],
      currentTenantId: 'tenant-1',
    })

    // Act
    const { result } = renderHook(() => useCurrentTenant())

    // Assert
    expect(result.current).toBeNull()
  })
})
