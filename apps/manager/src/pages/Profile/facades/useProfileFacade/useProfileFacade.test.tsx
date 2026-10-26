import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useProfileStore } from '@pages/Profile/states/profile/profile.state'
import { useProfileFormStore } from '@pages/Profile/states/profile-form/profile-form.state'

import { useProfileFacade } from './useProfileFacade'
import { useProfileFacadeMock } from './useProfileFacade.mock'

vi.mock('@pages/Profile/states/profile-form/profile-form.state')
vi.mock('@pages/Profile/states/profile/profile.state')

describe('useProfileFacade', () => {
  it('composes profile loading and form state', () => {
    const load = vi.fn()
    vi.mocked(useProfileStore).mockImplementation(((
      selector: (state: never) => unknown
    ) =>
      selector({
        profile: null,
        status: useProfileFacadeMock.status,
        error: null,
        load,
      } as never)) as never)
    vi.mocked(useProfileFormStore).mockReturnValue({ draft: {} } as never)

    const { result } = renderHook(() => useProfileFacade())

    expect(result.current.status).toBe('success')
    expect(result.current.form).toEqual({ draft: {} })
    expect(load).toHaveBeenCalled()
  })
})
