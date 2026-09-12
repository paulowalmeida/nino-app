import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'

import { useRequestOtp } from './useRequestOtp'
import { useRequestOtpMock } from './useRequestOtp.mock'

vi.mock('@shared/services/consumer-auth/consumer-auth.service')

let mutationFn: ((credentials: unknown) => unknown) | undefined

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useMutation: (options: { mutationFn: typeof mutationFn }) => {
      mutationFn = options.mutationFn
      return { mutate: vi.fn() }
    },
  }
})

describe('useRequestOtp', () => {
  it('sends the credentials to the OTP request service', () => {
    // Arrange
    renderHook(() => useRequestOtp())
    // Act
    mutationFn?.(useRequestOtpMock.credentials)
    // Assert
    expect(consumerAuthService.requestOtp).toHaveBeenCalledWith(
      useRequestOtpMock.credentials
    )
  })
})
