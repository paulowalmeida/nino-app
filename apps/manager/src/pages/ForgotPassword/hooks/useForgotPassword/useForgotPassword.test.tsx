import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AuthService } from '@shared/services/auth/auth.service'

import { useForgotPassword } from './useForgotPassword'
import { forgotPasswordRequestMock } from './useForgotPassword.mock'

const mutateAsync = vi.fn()
let mutationFn: typeof AuthService.forgotPassword | undefined

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useMutation: (options: { mutationFn: typeof AuthService.forgotPassword }) => {
      mutationFn = options.mutationFn
      return { mutateAsync }
    },
  }
})

describe(useForgotPassword.name, () => {
  it('sends the request through AuthService.forgotPassword', () => {
    renderHook(() => useForgotPassword())

    expect(mutationFn).toBe(AuthService.forgotPassword)
  })

  it('exposes the mutation trigger', async () => {
    mutateAsync.mockResolvedValue({ message: 'ok' })
    const { result } = renderHook(() => useForgotPassword())

    await result.current.mutateAsync(forgotPasswordRequestMock)

    expect(mutateAsync).toHaveBeenCalledWith(forgotPasswordRequestMock)
  })
})
