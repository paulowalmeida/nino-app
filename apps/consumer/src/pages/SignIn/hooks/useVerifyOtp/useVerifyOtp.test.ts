import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { Consumer } from '@custom_types/consumer/consumer'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'
import { rememberSession } from '@utils/session-hint'

import { useVerifyOtp } from './useVerifyOtp'
import { useVerifyOtpMock } from './useVerifyOtp.mock'

vi.mock('@shared/services/consumer-auth/consumer-auth.service')
vi.mock('@utils/session-hint')

const setQueryData = vi.fn()

let onSuccess: ((consumer: Consumer) => void) | undefined
let mutationFn: ((input: unknown) => unknown) | undefined

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueryClient: () => ({ setQueryData }),
    useMutation: (options: {
      mutationFn: typeof mutationFn
      onSuccess: typeof onSuccess
    }) => {
      mutationFn = options.mutationFn
      onSuccess = options.onSuccess
      return { mutate: vi.fn() }
    },
  }
})

describe('useVerifyOtp', () => {
  it('sends the credentials and code to the OTP verify service', () => {
    // Arrange
    renderHook(() => useVerifyOtp())
    // Act
    mutationFn?.({
      credentials: useVerifyOtpMock.credentials,
      code: useVerifyOtpMock.code,
    })
    // Assert
    expect(consumerAuthService.verifyOtp).toHaveBeenCalledWith(
      useVerifyOtpMock.credentials,
      useVerifyOtpMock.code
    )
  })

  it('remembers the session and caches the consumer on success', () => {
    // Arrange
    renderHook(() => useVerifyOtp())
    const consumer = useVerifyOtpMock.consumer as unknown as Consumer
    // Act
    onSuccess?.(consumer)
    // Assert
    expect(rememberSession).toHaveBeenCalled()
    expect(setQueryData).toHaveBeenCalledWith(queryKeys.session.all, consumer)
  })
})
