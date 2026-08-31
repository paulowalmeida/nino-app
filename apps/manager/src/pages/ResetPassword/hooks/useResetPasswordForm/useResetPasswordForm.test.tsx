import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useResetPassword } from '@pages/ResetPassword/hooks/useResetPassword/useResetPassword'
import { authErrorMessage } from '@pages/ResetPassword/utils/authErrorMessage/authErrorMessage'

import { useResetPasswordForm } from './useResetPasswordForm'
import {
  resetPasswordFormFailureMessageMock,
  resetPasswordFormValuesMock,
} from './useResetPasswordForm.mock'

const navigate = vi.fn()
let searchParams = new URLSearchParams({ token: 'raw-token' })

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
  useSearchParams: () => [searchParams],
}))
vi.mock('@pages/ResetPassword/hooks/useResetPassword/useResetPassword')
vi.mock('@pages/ResetPassword/utils/authErrorMessage/authErrorMessage')

const mutateAsync = vi.fn()

const typePassword = (result: { current: ReturnType<typeof useResetPasswordForm> }) => {
  act(() => {
    result.current.register('password').onChange({
      target: { name: 'password', value: resetPasswordFormValuesMock.password },
    })
  })
}

describe('useResetPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    searchParams = new URLSearchParams({ token: 'raw-token' })
    vi.mocked(useResetPassword).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useResetPassword>)
    vi.mocked(authErrorMessage).mockReturnValue(
      resetPasswordFormFailureMessageMock
    )
  })

  it('reads the token from the URL and submits the new password', async () => {
    mutateAsync.mockResolvedValue({ message: 'ok' })
    const { result } = renderHook(() => useResetPasswordForm())

    typePassword(result)
    await act(() => result.current.submit())

    expect(mutateAsync).toHaveBeenCalledWith({
      token: 'raw-token',
      password: resetPasswordFormValuesMock.password,
    })
    expect(navigate).toHaveBeenCalledWith('/entrar')
  })

  it('reports a failed reset on the form, without navigating away', async () => {
    mutateAsync.mockRejectedValue(new Error('expired'))
    const { result } = renderHook(() => useResetPasswordForm())

    typePassword(result)
    await act(() => result.current.submit())

    await waitFor(() =>
      expect(result.current.formState.errors.root?.message).toBe(
        resetPasswordFormFailureMessageMock
      )
    )
    expect(navigate).not.toHaveBeenCalled()
  })

  it('reports whether the link carried a token', () => {
    searchParams = new URLSearchParams()
    const { result } = renderHook(() => useResetPasswordForm())

    expect(result.current.hasToken).toBe(false)
  })

  it('keeps sending while the mutation is pending', () => {
    vi.mocked(useResetPassword).mockReturnValue({
      mutateAsync,
      isPending: true,
    } as unknown as ReturnType<typeof useResetPassword>)

    const { result } = renderHook(() => useResetPasswordForm())

    expect(result.current.isSending).toBe(true)
  })
})
