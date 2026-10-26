import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useCashDate } from '../../hooks/useCashDate/useCashDate'
import { useCashSession } from '../../hooks/useCashSession/useCashSession'
import { openSessionMock } from '../../hooks/useCashSession/useCashSession.mock'
import { useCashFacade } from './useCashFacade'
import { cashFacadeShapeMock } from './useCashFacade.mock'

const commands = {
  submitOpen: vi.fn(),
  submitMovement: vi.fn(),
  submitClose: vi.fn(),
  isOpening: false,
  isMoving: false,
  isClosing: false,
}

const today = new Date('2026-08-30T00:00:00')
const setDate = vi.fn()

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')

vi.mock('../../hooks/useCashDate/useCashDate')

vi.mock('../../hooks/useCashSession/useCashSession')

vi.mock('../../hooks/useCashCommands/useCashCommands', () => ({
  useCashCommands: vi.fn(() => commands),
}))

describe(useCashFacade.name, () => {
  beforeEach(() => {
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: 'unit-1',
    } as unknown as ReturnType<typeof useCurrentUnit>)
    vi.mocked(useCashDate).mockReturnValue({
      date: today,
      dateKey: '2026-08-30',
      isToday: true,
      setDate,
    })
    vi.mocked(useCashSession).mockReturnValue({
      session: openSessionMock,
      isLoadingSession: false,
      isSessionError: false,
      currentSession: openSessionMock,
    })
  })

  it('exposes the session, the date selection, and every command of the feature', () => {
    const { result } = renderHook(() => useCashFacade())

    cashFacadeShapeMock.forEach((field) => {
      expect(result.current).toHaveProperty(field)
    })
  })

  it('hands the session straight through', () => {
    const { result } = renderHook(() => useCashFacade())

    expect(result.current.session).toEqual(openSessionMock)
  })

  it('exposes the commands without wrapping them', () => {
    const { result } = renderHook(() => useCashFacade())

    expect(result.current.submitOpen).toBe(commands.submitOpen)
    expect(result.current.submitClose).toBe(commands.submitClose)
  })

  it('binds commands to the currently open session, not the displayed one', () => {
    vi.mocked(useCashDate).mockReturnValue({
      date: new Date('2026-08-29T00:00:00'),
      dateKey: '2026-08-29',
      isToday: false,
      setDate,
    })

    renderHook(() => useCashFacade())

    expect(useCashSession).toHaveBeenCalledWith('unit-1', false, '2026-08-29')
  })

  it('works without a store and without an open session', () => {
    // Arrange
    vi.mocked(useCurrentUnit).mockReturnValue(
      undefined as unknown as ReturnType<typeof useCurrentUnit>
    )
    vi.mocked(useCashSession).mockReturnValue({
      session: null,
      isLoadingSession: true,
      isSessionError: false,
      currentSession: null,
    })

    // Act
    const { result } = renderHook(() => useCashFacade())

    // Assert
    expect(result.current.session).toBeNull()
    expect(useCashSession).toHaveBeenCalledWith(null, true, '2026-08-30')
  })
})
