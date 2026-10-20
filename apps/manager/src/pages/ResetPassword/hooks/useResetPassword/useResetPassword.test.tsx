import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AuthService } from '@shared/services/auth/auth.service'

import { useResetPassword } from './useResetPassword'
import { resetPasswordRequestMock } from './useResetPassword.mock'

const mutateAsync = vi.fn()
let mutationFn: typeof AuthService.resetPassword | undefined

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useMutation: (options: {
      mutationFn: typeof AuthService.resetPassword
    }) => {
      mutationFn = options.mutationFn
      return { mutateAsync }
    },
  }
})

describe(useResetPassword.name, () => {
  it('sends the request through AuthService.resetPassword', () => {
    renderHook(() => useResetPassword())

    expect(mutationFn).toBe(AuthService.resetPassword)
  })

  it('exposes the mutation trigger', async () => {
    mutateAsync.mockResolvedValue({ message: 'ok' })
    const { result } = renderHook(() => useResetPassword())

    await result.current.mutateAsync(resetPasswordRequestMock)

    expect(mutateAsync).toHaveBeenCalledWith(resetPasswordRequestMock)
  })
})
