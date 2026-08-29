import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRequestOtp } from '@pages/sign-in/hooks/useRequestOtp/useRequestOtp'
import { useVerifyOtp } from '@pages/sign-in/hooks/useVerifyOtp/useVerifyOtp'

import { useSignInMutations } from './useSignInMutations'
import { useSignInMutationsMock } from './useSignInMutations.mock'

const navigate = vi.fn()
const requestMutate = vi.fn()
const verifyMutate = vi.fn()

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('@pages/sign-in/hooks/useRequestOtp/useRequestOtp')
vi.mock('@pages/sign-in/hooks/useVerifyOtp/useVerifyOtp')

describe('useSignInMutations', () => {
  beforeEach(() => {
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
  })

  it('requests the code and advances the step on success', () => {
    // Arrange
    const onCodeRequested = vi.fn()
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, onCodeRequested)
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

  it('verifies the code and navigates home on success', () => {
    // Arrange
    const { result } = renderHook(() =>
      useSignInMutations(useSignInMutationsMock.home, vi.fn())
    )

    // Act
    result.current.verifyCode(
      useSignInMutationsMock.credentials,
      useSignInMutationsMock.code
    )
    const [, options] = verifyMutate.mock.calls[0]
    options.onSuccess()

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
})
