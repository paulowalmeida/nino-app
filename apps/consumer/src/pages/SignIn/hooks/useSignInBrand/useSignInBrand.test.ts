import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStore } from '@hooks/useStore/useStore'

import { useSignInBrand } from './useSignInBrand'
import { useSignInBrandMock } from './useSignInBrand.mock'

vi.mock('@hooks/useStore/useStore')
vi.mock('react-router', () => ({
  useParams: () => ({ slug: useSignInBrandMock.slug }),
}))

describe('useSignInBrand', () => {
  it('resolves the store for the current slug and the way back home', () => {
    // Arrange
    vi.mocked(useStore).mockReturnValue({
      store: useSignInBrandMock.store,
    } as unknown as ReturnType<typeof useStore>)

    // Act
    const { result } = renderHook(() => useSignInBrand())

    // Assert
    expect(useStore).toHaveBeenCalledWith(useSignInBrandMock.slug)
    expect(result.current.store).toBe(useSignInBrandMock.store)
    expect(result.current.home).toBe(`/${useSignInBrandMock.slug}`)
  })
})
