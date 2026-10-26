import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryClient } from '@lib/query-client/query-client'
import { clearRegisteredSession } from '@shared/services/session/session-bridge'
import { forgetSession } from '@shared/utils/session-hint/session-hint'

import { endSession } from './end-session'
import { endSessionMock } from './end-session.mock'

vi.mock('@lib/query-client/query-client', () => ({
  queryClient: { clear: vi.fn() },
}))
vi.mock('@shared/services/session/session-bridge', () => ({
  clearRegisteredSession: vi.fn(),
}))
vi.mock('@shared/utils/session-hint/session-hint', () => ({
  forgetSession: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  window.history.replaceState({}, '', endSessionMock.loginPath)
  window.localStorage.setItem(endSessionMock.draftStorageKey, '{}')
})

describe(endSession.name, () => {
  it('clears session state, query cache, draft and session hint', () => {
    endSession()

    expect(clearRegisteredSession).toHaveBeenCalledOnce()
    expect(queryClient.clear).toHaveBeenCalledOnce()
    expect(window.localStorage.getItem(endSessionMock.draftStorageKey)).toBeNull()
    expect(forgetSession).toHaveBeenCalledOnce()
  })
})
