import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCompleteProfile } from '@shared/hooks/useCompleteProfile/useCompleteProfile'
import { useRequestPhoneLink } from '@shared/hooks/useRequestPhoneLink/useRequestPhoneLink'
import { useVerifyPhoneLink } from '@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink'
import { useRequestOtp } from '@pages/sign-in/hooks/useRequestOtp/useRequestOtp'
import { useVerifyOtp } from '@pages/sign-in/hooks/useVerifyOtp/useVerifyOtp'

import { useSignInMutations } from './useSignInMutations'
import { useSignInMutationsMock } from './useSignInMutations.mock'

const navigate = vi.fn()
const requestMutate = vi.fn()
const verifyMutate = vi.fn()
const requestLinkMutate = vi.fn()
const verifyLinkMutate = vi.fn()
const completeProfileMutate = vi.fn()
let searchParams = new URLSearchParams()

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
  useSearchParams: () => [searchParams],
}))
vi.mock('@pages/sign-in/hooks/useRequestOtp/useRequestOtp')
vi.mock('@pages/sign-in/hooks/useVerifyOtp/useVerifyOtp')
vi.mock('@shared/hooks/useRequestPhoneLink/useRequestPhoneLink')
vi.mock('@shared/hooks/useVerifyPhoneLink/useVerifyPhoneLink')
vi.mock('@shared/hooks/useCompleteProfile/useCompleteProfile')

const renderMutations = (
  handlers: {
    onCodeRequested?: () => void
    goToCompleteProfile?: (name: string) => void
    onPhoneCodeRequested?: () => void
  } = {},
  customer: Parameters<typeof useSignInMutations>[2] = null
) =>
  renderHook(() =>
    useSignInMutations(
      useSignInMutationsMock.home,
      {
        onCodeRequested: handlers.onCodeRequested ?? vi.fn(),
        goToCompleteProfile: handlers.goToCompleteProfile ?? vi.fn(),
        onPhoneCodeRequested: handlers.onPhoneCodeRequested ?? vi.fn(),
      },
      customer
    )
  )

describe('useSignInMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    searchParams = new URLSearchParams()

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
    const { result } = renderMutations({ onCodeRequested })

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
    const { result } = renderMutations()

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
    const { result } = renderMutations({ goToCompleteProfile })

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

  it('sends an already-completed session home without any click', () => {
    // Arrange
    // Act
    renderMutations({}, useSignInMutationsMock.completedCustomer)

    // Assert
    expect(navigate).toHaveBeenCalledWith(useSignInMutationsMock.home, {
      replace: true,
    })
  })

  it('sends an already-logged-in incomplete session to complete', () => {
    // Arrange
    const goToCompleteProfile = vi.fn()

    // Act
    renderMutations(
      { goToCompleteProfile },
      useSignInMutationsMock.incompleteCustomer
    )

    // Assert
    expect(goToCompleteProfile).toHaveBeenCalledWith(
      useSignInMutationsMock.incompleteCustomer.name
    )
  })

  it('reports the google failure carried by the api redirect', () => {
    // Arrange
    searchParams = new URLSearchParams('googleError=1')

    // Act
    const { result } = renderMutations()

    // Assert
    expect(result.current.googleFailed).toBe(true)
  })

  it('requests a phone link code and advances the step on success', () => {
    // Arrange
    const onPhoneCodeRequested = vi.fn()
    const { result } = renderMutations({ onPhoneCodeRequested })

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
    const { result } = renderMutations()

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
    const { result } = renderMutations()

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
    const { result } = renderMutations()

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
