import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCompleteProfile } from '@pages/Profile/hooks/useCompleteProfile/useCompleteProfile'
import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useProfileFacade } from './useProfileFacade'
import { useProfileFacadeMock } from './useProfileFacade.mock'

vi.mock('@pages/Profile/hooks/useCompleteProfile/useCompleteProfile')
vi.mock('@shared/hooks/useCustomerSession/useCustomerSession')

describe('useProfileFacade', () => {
  it('exposes only profile data and commands', () => {
    const completeProfile = vi.fn()
    vi.mocked(useCustomerSession).mockReturnValue({
      customer: useProfileFacadeMock.customer,
    } as never)
    vi.mocked(useCompleteProfile).mockReturnValue({
      mutate: completeProfile,
      isPending: false,
    } as never)

    const { result } = renderHook(() => useProfileFacade())

    expect(result.current).toEqual({
      customer: useProfileFacadeMock.customer,
      completeProfile,
      isCompletingProfile: false,
    })
  })
})
