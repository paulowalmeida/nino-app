import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useLoginForm } from '@pages/Login/hooks/useLoginForm/useLoginForm'

import { useLoginFacade } from './useLoginFacade'
import { loginFacadeMock } from './useLoginFacade.mock'

vi.mock('@pages/Login/hooks/useLoginForm/useLoginForm')

describe('useLoginFacade', () => {
  it('names the form contract the screen consumes', () => {
    const register = vi.fn()
    const submit = vi.fn()
    vi.mocked(useLoginForm).mockReturnValue({
      register,
      submit,
      formState: {
        errors: { root: { message: loginFacadeMock.rootErrorMessage } },
      },
      isSending: false,
    } as unknown as ReturnType<typeof useLoginForm>)

    const { result } = renderHook(() => useLoginFacade())

    expect(result.current.register).toBe(register)
    expect(result.current.submit).toBe(submit)
    expect(result.current.fieldErrors.root?.message).toBe(
      loginFacadeMock.rootErrorMessage
    )
    expect(result.current.isSending).toBe(false)
  })

  it('reports the sending state of the login attempt', () => {
    vi.mocked(useLoginForm).mockReturnValue({
      register: vi.fn(),
      submit: vi.fn(),
      formState: { errors: {} },
      isSending: true,
    } as unknown as ReturnType<typeof useLoginForm>)

    const { result } = renderHook(() => useLoginFacade())

    expect(result.current.isSending).toBe(true)
  })
})
