import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLogin } from '@pages/Login/hooks/useLogin/useLogin'
import { authErrorMessage } from '@pages/Login/utils/authErrorMessage/authErrorMessage'

import { useLoginForm } from './useLoginForm'
import {
  loginCredentialsMock,
  loginFailureMessageMock,
} from './useLoginForm.mock'

vi.mock('@pages/Login/hooks/useLogin/useLogin')
vi.mock('@pages/Login/utils/authErrorMessage/authErrorMessage')

const mutateAsync = vi.fn()

const typeCredentials = (
  result: { current: ReturnType<typeof useLoginForm> },
  target = loginCredentialsMock
) => {
  act(() => {
    result.current.register('email').onChange({
      target: { name: 'email', value: target.email },
    })
    result.current.register('password').onChange({
      target: { name: 'password', value: target.password },
    })
  })
}

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useLogin>)
    vi.mocked(authErrorMessage).mockReturnValue(loginFailureMessageMock)
  })

  it('sends what the person typed', async () => {
    mutateAsync.mockResolvedValue({ id: 'user-1' })
    const { result } = renderHook(() => useLoginForm())

    typeCredentials(result)
    await act(() => result.current.submit())

    expect(mutateAsync).toHaveBeenCalledWith(loginCredentialsMock)
    expect(result.current.formState.errors.root).toBeUndefined()
  })

  it('answers a rejected login on the form, never on a field', async () => {
    mutateAsync.mockRejectedValue(new Error('401'))
    const { result } = renderHook(() => useLoginForm())

    typeCredentials(result)
    await act(() => result.current.submit())

    await waitFor(() =>
      expect(result.current.formState.errors.root?.message).toBe(
        loginFailureMessageMock
      )
    )
    expect(result.current.formState.errors.email).toBeUndefined()
    expect(result.current.formState.errors.password).toBeUndefined()
  })

  it('keeps sending while the session navigates away', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync,
      isPending: true,
    } as unknown as ReturnType<typeof useLogin>)

    const { result } = renderHook(() => useLoginForm())

    expect(result.current.isSending).toBe(true)
  })
})
