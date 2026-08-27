import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useWelcomeOnboarding } from '@pages/Welcome/hooks/useWelcomeOnboarding/useWelcomeOnboarding'

import { useWelcomeFacade } from './useWelcomeFacade'
import { welcomeFacadeMock } from './useWelcomeFacade.mock'

vi.mock('@pages/Welcome/hooks/useWelcomeOnboarding/useWelcomeOnboarding')

describe('useWelcomeFacade', () => {
  it('exposes the greeting name and the leave command', () => {
    const leave = vi.fn()
    vi.mocked(useWelcomeOnboarding).mockReturnValue({
      firstName: welcomeFacadeMock.firstName,
      leave,
    })

    const { result } = renderHook(() => useWelcomeFacade())

    expect(result.current.firstName).toBe(welcomeFacadeMock.firstName)
    expect(result.current.leave).toBe(leave)
  })
})
