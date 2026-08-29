import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import { verifyOtp } from '@services/customer-auth.service'
import { rememberSession } from '@utils/session-hint'

import { useVerifyOtp } from './useVerifyOtp'
import { useVerifyOtpMock } from './useVerifyOtp.mock'

vi.mock('@services/customer-auth.service')
vi.mock('@utils/session-hint')

const setQueryData = vi.fn()

let onSuccess: ((customer: Customer) => void) | undefined
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
    expect(verifyOtp).toHaveBeenCalledWith(
      useVerifyOtpMock.credentials,
      useVerifyOtpMock.code
    )
  })

  it('remembers the session and caches the customer on success', () => {
    // Arrange
    renderHook(() => useVerifyOtp())
    const customer = useVerifyOtpMock.customer as unknown as Customer
    // Act
    onSuccess?.(customer)
    // Assert
    expect(rememberSession).toHaveBeenCalled()
    expect(setQueryData).toHaveBeenCalledWith(
      queryKeys.session.all,
      customer
    )
  })
})
