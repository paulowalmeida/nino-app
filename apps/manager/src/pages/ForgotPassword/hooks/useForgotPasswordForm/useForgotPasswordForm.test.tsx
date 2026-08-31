import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useForgotPassword } from '@pages/ForgotPassword/hooks/useForgotPassword/useForgotPassword'
import { authErrorMessage } from '@pages/ForgotPassword/utils/authErrorMessage/authErrorMessage'

import { useForgotPasswordForm } from './useForgotPasswordForm'
import {
  forgotPasswordFormCredentialsMock,
  forgotPasswordFormFailureMessageMock,
} from './useForgotPasswordForm.mock'

vi.mock('@pages/ForgotPassword/hooks/useForgotPassword/useForgotPassword')
vi.mock('@pages/ForgotPassword/utils/authErrorMessage/authErrorMessage')

const mutateAsync = vi.fn()

const typeEmail = (result: { current: ReturnType<typeof useForgotPasswordForm> }) => {
  act(() => {
    result.current.register('email').onChange({
      target: { name: 'email', value: forgotPasswordFormCredentialsMock.email },
    })
  })
}

describe('useForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useForgotPassword).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useForgotPassword>)
    vi.mocked(authErrorMessage).mockReturnValue(
      forgotPasswordFormFailureMessageMock
    )
  })

  it('sends the typed e-mail and marks the request as sent', async () => {
    mutateAsync.mockResolvedValue({ message: 'ok' })
    const { result } = renderHook(() => useForgotPasswordForm())

    typeEmail(result)
    await act(() => result.current.submit())

    expect(mutateAsync).toHaveBeenCalledWith(forgotPasswordFormCredentialsMock)
    expect(result.current.sentTo).toBe(
      forgotPasswordFormCredentialsMock.email
    )
  })

  it('reports a failed request on the form, not as sent', async () => {
    mutateAsync.mockRejectedValue(new Error('network'))
    const { result } = renderHook(() => useForgotPasswordForm())

    typeEmail(result)
    await act(() => result.current.submit())

    await waitFor(() =>
      expect(result.current.formState.errors.root?.message).toBe(
        forgotPasswordFormFailureMessageMock
      )
    )
    expect(result.current.sentTo).toBeNull()
  })

  it('returns to the form when the address needs fixing', async () => {
    mutateAsync.mockResolvedValue({ message: 'ok' })
    const { result } = renderHook(() => useForgotPasswordForm())

    typeEmail(result)
    await act(() => result.current.submit())
    act(() => result.current.useAnotherEmail())

    expect(result.current.sentTo).toBeNull()
  })

  it('keeps sending while the mutation is pending', () => {
    vi.mocked(useForgotPassword).mockReturnValue({
      mutateAsync,
      isPending: true,
    } as unknown as ReturnType<typeof useForgotPassword>)

    const { result } = renderHook(() => useForgotPasswordForm())

    expect(result.current.isSending).toBe(true)
  })
})
