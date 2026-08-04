import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { useSessionStore } from '@states/useSessionStore'

import { twoCompaniesMemberships } from './useCompanyGroups.mock'

describe(useCompanyGroups.name, () => {
  afterEach(() => {
    useSessionStore.setState({ memberships: [] })
  })

  it('groups tenants under their own company', () => {
    // Arrange
    useSessionStore.setState({ memberships: twoCompaniesMemberships })

    // Act
    const { result } = renderHook(() => useCompanyGroups())

    // Assert
    expect(result.current).toHaveLength(2)
    expect(result.current[0].units).toHaveLength(2)
    expect(result.current[1].units).toHaveLength(1)
  })

  it('returns no groups with no memberships', () => {
    // Arrange / Act
    const { result } = renderHook(() => useCompanyGroups())

    // Assert
    expect(result.current).toEqual([])
  })
})
