import { MemoryRouter } from 'react-router'

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@shared/states/session/session.state'
import { rememberOnboarding } from '@shared/utils/onboarding-seen/onboarding-seen'

import { useWelcomeOnboarding } from './useWelcomeOnboarding'
import { welcomeOnboardingMock } from './useWelcomeOnboarding.mock'

const navigate = vi.fn()

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => navigate,
}))
vi.mock('@shared/states/session/session.state')
vi.mock('@shared/utils/onboarding-seen/onboarding-seen')

const renderOnboarding = () =>
  renderHook(() => useWelcomeOnboarding(), { wrapper: MemoryRouter })

describe('useWelcomeOnboarding', () => {
  beforeEach(() => vi.clearAllMocks())

  it('greets by the first name of whoever is signed in', () => {
    vi.mocked(useSessionStore).mockImplementation((selector) =>
      selector({
        user: { name: welcomeOnboardingMock.fullName },
      } as unknown as Parameters<typeof selector>[0])
    )

    const { result } = renderOnboarding()

    expect(result.current.firstName).toBe(welcomeOnboardingMock.first)
  })

  it('greets with nothing when there is no session yet', () => {
    vi.mocked(useSessionStore).mockImplementation((selector) =>
      selector({ user: null } as unknown as Parameters<typeof selector>[0])
    )

    const { result } = renderOnboarding()

    expect(result.current.firstName).toBe('')
  })

  it('remembers the tour was seen and sends the owner to their units', () => {
    vi.mocked(useSessionStore).mockImplementation((selector) =>
      selector({ user: null } as unknown as Parameters<typeof selector>[0])
    )
    const { result } = renderOnboarding()

    result.current.leave()

    expect(rememberOnboarding).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('/unidades')
  })
})
