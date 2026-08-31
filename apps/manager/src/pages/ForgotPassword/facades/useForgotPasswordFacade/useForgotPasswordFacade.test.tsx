import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useForgotPasswordForm } from '@pages/ForgotPassword/hooks/useForgotPasswordForm/useForgotPasswordForm'

import { useForgotPasswordFacade } from './useForgotPasswordFacade'
import { forgotPasswordFacadeMock } from './useForgotPasswordFacade.mock'

vi.mock('@pages/ForgotPassword/hooks/useForgotPasswordForm/useForgotPasswordForm')

describe('useForgotPasswordFacade', () => {
  it('names the form contract the screen consumes', () => {
    const register = vi.fn()
    const submit = vi.fn()
    vi.mocked(useForgotPasswordForm).mockReturnValue({
      register,
      submit,
      formState: {
        errors: { root: { message: forgotPasswordFacadeMock.rootErrorMessage } },
      },
      isSending: false,
      isSent: false,
    } as unknown as ReturnType<typeof useForgotPasswordForm>)

    const { result } = renderHook(() => useForgotPasswordFacade())

    expect(result.current.register).toBe(register)
    expect(result.current.submit).toBe(submit)
    expect(result.current.fieldErrors.root?.message).toBe(
      forgotPasswordFacadeMock.rootErrorMessage
    )
    expect(result.current.isSending).toBe(false)
    expect(result.current.isSent).toBe(false)
  })

  it('reports the request as sent', () => {
    vi.mocked(useForgotPasswordForm).mockReturnValue({
      register: vi.fn(),
      submit: vi.fn(),
      formState: { errors: {} },
      isSending: false,
      isSent: true,
    } as unknown as ReturnType<typeof useForgotPasswordForm>)

    const { result } = renderHook(() => useForgotPasswordFacade())

    expect(result.current.isSent).toBe(true)
  })
})
