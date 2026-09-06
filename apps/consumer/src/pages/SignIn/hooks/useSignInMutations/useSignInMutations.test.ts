import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCompleteProfile } from '@shared/hooks/useCompleteProfile/useCompleteProfile'
import { useRequestPhoneLink } from '@shared/hooks/useRequestPhoneLink/useRequestPhoneLink'
import { useVerifyPhoneLink } from '@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink'
import { useGoogleSignIn } from '@pages/sign-in/hooks/useGoogleSignIn/useGoogleSignIn'
import { useRequestOtp } from '@pages/sign-in/hooks/useRequestOtp/useRequestOtp'
import { useVerifyOtp } from '@pages/sign-in/hooks/useVerifyOtp/useVerifyOtp'

import { useSignInMutations } from './useSignInMutations'
import { useSignInMutationsMock } from './useSignInMutations.mock'

const navigate = vi.fn()
const requestMutate = vi.fn()
const verifyMutate = vi.fn()
const googleMutate = vi.fn()
const requestLinkMutate = vi.fn()
const verifyLinkMutate = vi.fn()
const completeProfileMutate = vi.fn()

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('@pages/sign-in/hooks/useRequestOtp/useRequestOtp')
vi.mock('@pages/sign-in/hooks/useVerifyOtp/useVerifyOtp')
vi.mock('@pages/sign-in/hooks/useGoogleSignIn/useGoogleSignIn')
vi.mock('@shared/hooks/useRequestPhoneLink/useRequestPhoneLink')
vi.mock('@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink')
vi.mock('@shared/hooks/useCompleteProfile/useCompleteProfile')

describe('useSignInMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useRequestOtp).mockReturnValue({
      mutate: requestMutate,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useRequestOtp>)
    vi.mocked(useVerifyOtp).mockReturnValue({
      mutate: verifyMutate,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useVerifyOtp>)
    vi.mocked(useGoogleSignIn).mockReturnValue({
      mutate: googleMutate,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useGoogleSignIn>)
    vi.mocked(useRequestPhoneLink).mockReturnValue({
      mutate: requestLinkMutate,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useRequestPhoneLink>)
    vi.mocked(useVerifyPhoneLink).mockReturnValue({
      mutate: verifyLinkMutate,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useVerifyPhoneLink>)
    vi.mocked(useCompleteProfile).mockReturnValue({
      mutate: completeProfileMutate,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useCompleteProfile>)
  })

  it('requests the code and advances the step on success', () => {
    // Arrange
    const onCodeRequested = vi.fn()
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, {
        onCodeRequested,
        goToCompleteProfile: vi.fn(),
        onPhoneCodeRequested: vi.fn(),
      })
    )

    // Act
    result.current.requestCode(useSignInMutationsMock.credentials)
    const [, options] = requestMutate.mock.calls[0]
    options.onSuccess()

    // Assert
    expect(requestMutate).toHaveBeenCalledWith(
      useSignInMutationsMock.credentials,
      expect.any(Object)
    )
    expect(onCodeRequested).toHaveBeenCalled()
  })

  it('sends a completed account home after verifying the code', () => {
    // Arrange
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, {
        onCodeRequested: vi.fn(),
        goToCompleteProfile: vi.fn(),
        onPhoneCodeRequested: vi.fn(),
      })
    )

    // Act
    result.current.verifyCode(
      useSignInMutationsMock.credentials,
      useSignInMutationsMock.code
    )
    const [, options] = verifyMutate.mock.calls[0]
    options.onSuccess(useSignInMutationsMock.completedCustomer)

    // Assert
    expect(verifyMutate).toHaveBeenCalledWith(
      {
        credentials: useSignInMutationsMock.credentials,
        code: useSignInMutationsMock.code,
      },
      expect.any(Object)
    )
    expect(navigate).toHaveBeenCalledWith(useSignInMutationsMock.home, {
      replace: true,
    })
  })

  it('sends an incomplete account to complete the profile instead', () => {
    // Arrange
    const goToCompleteProfile = vi.fn()
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, {
        onCodeRequested: vi.fn(),
        goToCompleteProfile,
        onPhoneCodeRequested: vi.fn(),
      })
    )

    // Act
    result.current.verifyCode(
      useSignInMutationsMock.credentials,
      useSignInMutationsMock.code
    )
    const [, options] = verifyMutate.mock.calls[0]
    options.onSuccess(useSignInMutationsMock.incompleteCustomer)

    // Assert
    expect(goToCompleteProfile).toHaveBeenCalledWith(
      useSignInMutationsMock.incompleteCustomer.name
    )
    expect(navigate).not.toHaveBeenCalled()
  })

  it('clears a placeholder name before completing the profile', () => {
    // Arrange
    const goToCompleteProfile = vi.fn()
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, {
        onCodeRequested: vi.fn(),
        goToCompleteProfile,
        onPhoneCodeRequested: vi.fn(),
      })
    )

    // Act
    result.current.signInWithGoogle('id-token')
    const [, options] = googleMutate.mock.calls[0]
    options.onSuccess(useSignInMutationsMock.incompleteEmailPlaceholder)

    // Assert
    expect(goToCompleteProfile).toHaveBeenCalledWith('')
  })

  it('keeps a real name when google already sent one', () => {
    // Arrange
    const goToCompleteProfile = vi.fn()
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, {
        onCodeRequested: vi.fn(),
        goToCompleteProfile,
        onPhoneCodeRequested: vi.fn(),
      })
    )

    // Act
    result.current.signInWithGoogle('id-token')
    const [, options] = googleMutate.mock.calls[0]
    options.onSuccess(useSignInMutationsMock.incompleteCustomer)

    // Assert
    expect(goToCompleteProfile).toHaveBeenCalledWith(
      useSignInMutationsMock.incompleteCustomer.name
    )
  })

  it('requests a phone link code and advances the step on success', () => {
    // Arrange
    const onPhoneCodeRequested = vi.fn()
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, {
        onCodeRequested: vi.fn(),
        goToCompleteProfile: vi.fn(),
        onPhoneCodeRequested,
      })
    )

    // Act
    result.current.requestPhoneCode(useSignInMutationsMock.phone)
    const [, options] = requestLinkMutate.mock.calls[0]
    options.onSuccess()

    // Assert
    expect(requestLinkMutate).toHaveBeenCalledWith(
      { phone: useSignInMutationsMock.phone },
      expect.any(Object)
    )
    expect(onPhoneCodeRequested).toHaveBeenCalled()
  })

  it('navigates home once the phone link code is verified', () => {
    // Arrange
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, {
        onCodeRequested: vi.fn(),
        goToCompleteProfile: vi.fn(),
        onPhoneCodeRequested: vi.fn(),
      })
    )

    // Act
    result.current.verifyPhoneCode(
      useSignInMutationsMock.phone,
      useSignInMutationsMock.code
    )
    const [, options] = verifyLinkMutate.mock.calls[0]
    options.onSuccess()

    // Assert
    expect(navigate).toHaveBeenCalledWith(useSignInMutationsMock.home, {
      replace: true,
    })
  })

  it('goes home right away when the completed profile has no phone', () => {
    // Arrange
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, {
        onCodeRequested: vi.fn(),
        goToCompleteProfile: vi.fn(),
        onPhoneCodeRequested: vi.fn(),
      })
    )

    // Act
    result.current.finishProfile(useSignInMutationsMock.name, '')
    const [, options] = completeProfileMutate.mock.calls[0]
    options.onSuccess()

    // Assert
    expect(completeProfileMutate).toHaveBeenCalledWith(
      { name: useSignInMutationsMock.name },
      expect.any(Object)
    )
    expect(navigate).toHaveBeenCalledWith(useSignInMutationsMock.home, {
      replace: true,
    })
  })

  it('asks for a phone code when the profile includes a phone', () => {
    // Arrange
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, {
        onCodeRequested: vi.fn(),
        goToCompleteProfile: vi.fn(),
        onPhoneCodeRequested: vi.fn(),
      })
    )

    // Act
    result.current.finishProfile(
      useSignInMutationsMock.name,
      useSignInMutationsMock.phone
    )
    const [, options] = completeProfileMutate.mock.calls[0]
    options.onSuccess()

    // Assert
    expect(requestLinkMutate).toHaveBeenCalledWith(
      { phone: useSignInMutationsMock.phone },
      expect.any(Object)
    )
    expect(navigate).not.toHaveBeenCalled()
  })
})
