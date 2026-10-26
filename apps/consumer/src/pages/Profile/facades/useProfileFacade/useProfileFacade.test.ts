import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCompleteProfile } from '@shared/hooks/useCompleteProfile/useCompleteProfile'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useRequestPhoneLink } from '@shared/hooks/useRequestPhoneLink/useRequestPhoneLink'
import { useVerifyPhoneLink } from '@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink'
import { useProfileFacade } from './useProfileFacade'
import { useProfileFacadeMock } from './useProfileFacade.mock'

vi.mock('@shared/hooks/useCompleteProfile/useCompleteProfile')
vi.mock('@shared/hooks/useConsumerSession/useConsumerSession')
vi.mock('@shared/hooks/useRequestPhoneLink/useRequestPhoneLink')
vi.mock('@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink')

describe('useProfileFacade', () => {
  it('exposes only profile data and commands', () => {
    const completeProfile = vi.fn()
    const requestPhoneLink = vi.fn()
    const verifyPhoneLink = vi.fn()
    vi.mocked(useConsumerSession).mockReturnValue({
      consumer: useProfileFacadeMock.consumer,
    } as unknown as ReturnType<typeof useConsumerSession>)
    vi.mocked(useCompleteProfile).mockReturnValue({
      mutate: completeProfile,
      isPending: false,
    } as unknown as ReturnType<typeof useCompleteProfile>)
    vi.mocked(useRequestPhoneLink).mockReturnValue({
      mutate: requestPhoneLink,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useRequestPhoneLink>)
    vi.mocked(useVerifyPhoneLink).mockReturnValue({
      mutate: verifyPhoneLink,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useVerifyPhoneLink>)

    const { result } = renderHook(() => useProfileFacade())

    expect(result.current).toEqual({
      consumer: useProfileFacadeMock.consumer,
      completeProfile,
      isCompletingProfile: false,
      requestPhoneLink,
      isRequestingPhoneLink: false,
      requestPhoneLinkFailed: false,
      verifyPhoneLink,
      isVerifyingPhoneLink: false,
      verifyPhoneLinkFailed: false,
    })
  })
})
