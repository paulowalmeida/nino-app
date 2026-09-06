import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'

import { useVerifyPhoneLink } from './useVerifyPhoneLink'
import { useVerifyPhoneLinkMock } from './useVerifyPhoneLink.mock'

vi.mock('@shared/services/customer-auth/customer-auth.service')

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

describe('useVerifyPhoneLink', () => {
  it('sends the phone and code to the link-verify service', () => {
    // Arrange
    renderHook(() => useVerifyPhoneLink())

    // Act
    mutationFn?.(useVerifyPhoneLinkMock.request)

    // Assert
    expect(customerAuthService.verifyPhoneLink).toHaveBeenCalledWith(
      useVerifyPhoneLinkMock.request
    )
  })

  it('caches the updated customer as the current session on success', () => {
    // Arrange
    renderHook(() => useVerifyPhoneLink())

    // Act
    onSuccess?.(useVerifyPhoneLinkMock.customer)

    // Assert
    expect(setQueryData).toHaveBeenCalledWith(
      queryKeys.session.all,
      useVerifyPhoneLinkMock.customer
    )
  })
})
