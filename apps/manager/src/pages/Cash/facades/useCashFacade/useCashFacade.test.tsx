import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

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

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant')

vi.mock('../../hooks/useCashSession/useCashSession')

vi.mock('../../hooks/useCashCommands/useCashCommands', () => ({
  useCashCommands: vi.fn(() => commands),
}))

describe(useCashFacade.name, () => {
  beforeEach(() => {
    vi.mocked(useCurrentTenant).mockReturnValue({
      tenantId: 'tenant-1',
    } as unknown as ReturnType<typeof useCurrentTenant>)
    vi.mocked(useCashSession).mockReturnValue({
      session: openSessionMock,
      isLoadingSession: false,
      isSessionError: false,
    })
  })

  it('exposes the session and every command of the feature', () => {
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

  it('works without a store and without an open session', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(
      undefined as unknown as ReturnType<typeof useCurrentTenant>
    )
    vi.mocked(useCashSession).mockReturnValue({
      session: null,
      isLoadingSession: true,
      isSessionError: false,
    })

    // Act
    const { result } = renderHook(() => useCashFacade())

    // Assert
    expect(result.current.session).toBeNull()
    expect(useCashSession).toHaveBeenCalledWith(null)
  })
})
