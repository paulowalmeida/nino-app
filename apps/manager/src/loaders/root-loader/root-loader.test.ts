import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  rootLoaderMultiCompanyMembershipsMock,
  rootLoaderSingleCompanyMembershipsMock,
  rootLoaderStaffMembershipsMock,
  rootLoaderUnsafeUnitMembershipsMock,
  rootLoaderUserMock,
} from './root-loader.mock'

const { getStateMock, redirectMock, sawOnboardingMock } = vi.hoisted(() => ({
  getStateMock: vi.fn(),
  redirectMock: vi.fn((location: string) => ({ location })),
  sawOnboardingMock: vi.fn(),
}))

vi.mock('react-router', () => ({ redirect: redirectMock }))
vi.mock('@shared/states/session/session.state', () => ({
  useSessionStore: { getState: getStateMock },
}))
vi.mock('@shared/utils/onboarding-seen/onboarding-seen', () => ({
  sawOnboarding: sawOnboardingMock,
}))

import { RootLoader } from './root-loader'

describe(RootLoader.name, () => {
  const loadMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    getStateMock.mockReturnValue({
      load: loadMock,
      memberships: [],
    })
    loadMock.mockResolvedValue(rootLoaderUserMock)
  })

  it('redirects unauthenticated users to login', async () => {
    loadMock.mockResolvedValue(null)

    await RootLoader()

    expect(redirectMock).toHaveBeenCalledWith('/entrar')
  })

  it('routes a user without units through onboarding only once', async () => {
    sawOnboardingMock.mockReturnValue(false)

    await RootLoader()

    expect(redirectMock).toHaveBeenCalledWith('/boas-vindas')
  })

  it('skips onboarding after it has already been seen', async () => {
    sawOnboardingMock.mockReturnValue(true)

    await RootLoader()

    expect(redirectMock).toHaveBeenCalledWith('/unidades')
  })

  it('routes users with memberships in different companies to company selection', async () => {
    getStateMock.mockReturnValue({
      load: loadMock,
      memberships: rootLoaderMultiCompanyMembershipsMock,
    })

    await RootLoader()

    expect(redirectMock).toHaveBeenCalledWith('/lojas')
  })

  it('opens the current unit when all memberships belong to one company', async () => {
    getStateMock.mockReturnValue({
      load: loadMock,
      memberships: rootLoaderSingleCompanyMembershipsMock,
    })

    await RootLoader()

    expect(redirectMock).toHaveBeenCalledWith('/unit-1/visao-geral')
  })

  it('keeps an API-provided unit id inside the local route', async () => {
    getStateMock.mockReturnValue({
      load: loadMock,
      memberships: rootLoaderUnsafeUnitMembershipsMock,
    })

    await RootLoader()

    expect(redirectMock).toHaveBeenCalledWith(
      '/%2F%2Fexternal.example/visao-geral'
    )
  })

  it('opens staff memberships at the staff home route', async () => {
    getStateMock.mockReturnValue({
      load: loadMock,
      memberships: rootLoaderStaffMembershipsMock,
    })

    await RootLoader()

    expect(redirectMock).toHaveBeenCalledWith('/unit-1/balcao')
  })
})
