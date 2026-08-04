import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  SLUG_TAKEN_MESSAGE,
  useCheckSlugAvailable,
} from '@hooks/store/useCheckSlugAvailable'
import { TenantService } from '@services/tenant.service'

vi.mock('@services/tenant.service')

describe(useCheckSlugAvailable.name, () => {
  it('returns true when the slug is available', async () => {
    // Arrange
    vi.mocked(TenantService.checkSlug).mockResolvedValue({ available: true })
    const { result } = renderHook(() => useCheckSlugAvailable())

    // Act
    const outcome = await result.current('padaria-boa')

    // Assert
    expect(outcome).toBe(true)
  })

  it('returns the taken message when the slug is not available', async () => {
    // Arrange
    vi.mocked(TenantService.checkSlug).mockResolvedValue({ available: false })
    const { result } = renderHook(() => useCheckSlugAvailable())

    // Act
    const outcome = await result.current('padaria-boa')

    // Assert
    expect(outcome).toBe(SLUG_TAKEN_MESSAGE)
  })

  it('lets the form through when the lookup fails', async () => {
    // Arrange
    vi.mocked(TenantService.checkSlug).mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useCheckSlugAvailable())

    // Act
    const outcome = await result.current('padaria-boa')

    // Assert
    expect(outcome).toBe(true)
  })
})
