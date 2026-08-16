import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { usePause } from '@hooks/store/usePause'
import { useStoreOpen } from '@hooks/store/useStoreOpen'

import { notPaused, openAllDay, paused } from './useStoreOpen.mock'

vi.mock('@hooks/settings/useOpeningHours')
vi.mock('@hooks/store/usePause')

const mockHours = (
  overrides: Partial<ReturnType<typeof useOpeningHours>> = {}
) =>
  vi.mocked(useOpeningHours).mockReturnValue({
    hours: [openAllDay],
    isPending: false,
    isError: false,
    ...overrides,
  } as unknown as ReturnType<typeof useOpeningHours>)

const mockPause = (data = notPaused) =>
  vi.mocked(usePause).mockReturnValue({
    data,
  } as unknown as ReturnType<typeof usePause>)

const renderStoreOpen = () =>
  renderHook(() => useStoreOpen('tenant-1', 'America/Sao_Paulo')).result
    .current

describe(useStoreOpen.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reports the store open inside the schedule and unpaused', () => {
    // Arrange
    mockHours()
    mockPause()

    // Act
    const state = renderStoreOpen()

    // Assert
    expect(state).toEqual({
      isOpen: true,
      isPending: false,
      hasSchedule: true,
    })
  })

  it('reports the store closed while a manual pause is on', () => {
    // Arrange
    mockHours()
    mockPause(paused)

    // Act
    const state = renderStoreOpen()

    // Assert
    expect(state.isOpen).toBe(false)
    expect(state.hasSchedule).toBe(true)
  })

  it('has no schedule when the hours list comes back empty', () => {
    // Arrange
    mockHours({ hours: [] })
    mockPause()

    // Act
    const state = renderStoreOpen()

    // Assert
    expect(state.hasSchedule).toBe(false)
    expect(state.isOpen).toBe(false)
  })

  it('has no schedule when the hours request fails', () => {
    // Arrange
    mockHours({ isError: true })
    mockPause()

    // Act
    const state = renderStoreOpen()

    // Assert
    expect(state.hasSchedule).toBe(false)
    expect(state.isOpen).toBe(false)
  })

  it('stays pending while the schedule is still loading', () => {
    // Arrange
    mockHours({ isPending: true })
    mockPause()

    // Act
    const state = renderStoreOpen()

    // Assert
    expect(state.isPending).toBe(true)
  })
})
