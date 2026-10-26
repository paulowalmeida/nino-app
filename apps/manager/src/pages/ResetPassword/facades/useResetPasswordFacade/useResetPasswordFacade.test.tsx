import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useResetPasswordForm } from '@pages/ResetPassword/hooks/useResetPasswordForm/useResetPasswordForm'

import { useResetPasswordFacade } from './useResetPasswordFacade'
import { resetPasswordFacadeMock } from './useResetPasswordFacade.mock'

vi.mock('@pages/ResetPassword/hooks/useResetPasswordForm/useResetPasswordForm')

describe('useResetPasswordFacade', () => {
  it('names the form contract the screen consumes', () => {
    const register = vi.fn()
    const submit = vi.fn()
    const getValues = vi.fn()
    vi.mocked(useResetPasswordForm).mockReturnValue({
      register,
      submit,
      getValues,
      formState: {
        errors: { root: { message: resetPasswordFacadeMock.rootErrorMessage } },
      },
      isSending: false,
      hasToken: true,
    } as unknown as ReturnType<typeof useResetPasswordForm>)

    const { result } = renderHook(() => useResetPasswordFacade())

    expect(result.current.register).toBe(register)
    expect(result.current.submit).toBe(submit)
    expect(result.current.getValues).toBe(getValues)
    expect(result.current.fieldErrors.root?.message).toBe(
      resetPasswordFacadeMock.rootErrorMessage
    )
    expect(result.current.isSending).toBe(false)
    expect(result.current.hasToken).toBe(true)
  })

  it('reports a missing token from the link', () => {
    vi.mocked(useResetPasswordForm).mockReturnValue({
      register: vi.fn(),
      submit: vi.fn(),
      getValues: vi.fn(),
      formState: { errors: {} },
      isSending: false,
      hasToken: false,
    } as unknown as ReturnType<typeof useResetPasswordForm>)

    const { result } = renderHook(() => useResetPasswordFacade())

    expect(result.current.hasToken).toBe(false)
  })
})
