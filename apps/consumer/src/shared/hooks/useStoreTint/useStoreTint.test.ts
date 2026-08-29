import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useParams } from 'react-router'

import { useStore } from '@hooks/useStore'
import { resolveSlug } from '@utils/resolve-slug'

import { useStoreTint } from './useStoreTint'
import { useStoreTintMock } from './useStoreTint.mock'

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useParams: vi.fn() }
})
vi.mock('@hooks/useStore')
vi.mock('@utils/resolve-slug')

describe('useStoreTint', () => {
  it('returns the store primary color once resolved', () => {
    // Arrange
    vi.mocked(useParams).mockReturnValue({ slug: useStoreTintMock.slug })
    vi.mocked(resolveSlug).mockReturnValue(useStoreTintMock.slug)
    vi.mocked(useStore).mockReturnValue({
      store: useStoreTintMock.store,
    } as unknown as ReturnType<typeof useStore>)

    // Act
    const { result } = renderHook(() => useStoreTint())

    // Assert
    expect(result.current).toBe(useStoreTintMock.store.primaryColor)
  })

  it('returns undefined when the store has not resolved yet', () => {
    // Arrange
    vi.mocked(useParams).mockReturnValue({ slug: undefined })
    vi.mocked(resolveSlug).mockReturnValue(null)
    vi.mocked(useStore).mockReturnValue({
      store: undefined,
    } as unknown as ReturnType<typeof useStore>)

    // Act
    const { result } = renderHook(() => useStoreTint())

    // Assert
    expect(result.current).toBeUndefined()
  })
})
