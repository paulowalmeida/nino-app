import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCompleteProfile } from '@shared/hooks/useCompleteProfile/useCompleteProfile'
import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useRequestPhoneLink } from '@shared/hooks/useRequestPhoneLink/useRequestPhoneLink'
import { useVerifyPhoneLink } from '@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink'
import { useProfileFacade } from './useProfileFacade'
import { useProfileFacadeMock } from './useProfileFacade.mock'

vi.mock('@shared/hooks/useCompleteProfile/useCompleteProfile')
vi.mock('@shared/hooks/useCustomerSession/useCustomerSession')
vi.mock('@shared/hooks/useRequestPhoneLink/useRequestPhoneLink')
vi.mock('@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink')

describe('useProfileFacade', () => {
  it('exposes only profile data and commands', () => {
    const completeProfile = vi.fn()
    const requestPhoneLink = vi.fn()
    const verifyPhoneLink = vi.fn()
    vi.mocked(useCustomerSession).mockReturnValue({
      customer: useProfileFacadeMock.customer,
    } as unknown as ReturnType<typeof useCustomerSession>)
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
      customer: useProfileFacadeMock.customer,
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
