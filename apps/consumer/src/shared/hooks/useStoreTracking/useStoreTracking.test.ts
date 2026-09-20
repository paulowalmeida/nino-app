import { renderHook } from '@testing-library/react'
import { useParams } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useStore } from '@hooks/useStore/useStore'
import { resolveSlug } from '@utils/resolve-slug'

import { useStoreTracking } from './useStoreTracking'
import {
  storeWithoutThemeMock,
  storeWithTrackingVoiceMock,
} from './useStoreTracking.mock'

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useParams: vi.fn() }
})
vi.mock('@hooks/useStore/useStore')
vi.mock('@utils/resolve-slug')

const renderWith = (fixture: typeof storeWithTrackingVoiceMock) => {
  vi.mocked(useParams).mockReturnValue({ slug: fixture.slug })
  vi.mocked(resolveSlug).mockReturnValue(fixture.slug)
  vi.mocked(useStore).mockReturnValue({
    store: fixture.store,
  } as unknown as ReturnType<typeof useStore>)

  return renderHook(() => useStoreTracking())
}

describe('useStoreTracking', () => {
  it('speaks the stage in the store own words when it wrote one', () => {
    // Arrange & Act
    const { result } = renderWith(storeWithTrackingVoiceMock)

    // Assert
    expect(result.current.stageLabel('PREPARING')).toBe('Tá na chapa')
  })

  it('keeps the nino wording for a stage the store left alone', () => {
    const { result } = renderWith(storeWithTrackingVoiceMock)

    expect(result.current.stageLabel('DELIVERED')).toBe('Pedido entregue')
  })

  it('exposes the waiting message the store wrote', () => {
    const { result } = renderWith(storeWithTrackingVoiceMock)

    expect(result.current.waitingMessage).toBe('Separa o guardanapo.')
  })

  it('falls back entirely for a store with no published theme', () => {
    const { result } = renderWith(storeWithoutThemeMock)

    expect(result.current.stageLabel('PREPARING')).toBe(
      'Sua comida está sendo preparada'
    )
    expect(result.current.waitingMessage).toBeNull()
  })
})
