import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'

import { useCompleteProfile } from './useCompleteProfile'
import { useCompleteProfileMock } from './useCompleteProfile.mock'

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

describe('useCompleteProfile', () => {
  it('sends the profile fields to the update service', () => {
    // Arrange
    renderHook(() => useCompleteProfile())

    // Act
    mutationFn?.(useCompleteProfileMock.request)

    // Assert
    expect(customerAuthService.updateMyProfile).toHaveBeenCalledWith(
      useCompleteProfileMock.request
    )
  })

  it('caches the updated customer as the current session on success', () => {
    // Arrange
    renderHook(() => useCompleteProfile())

    // Act
    onSuccess?.(useCompleteProfileMock.customer)

    // Assert
    expect(setQueryData).toHaveBeenCalledWith(
      queryKeys.session.all,
      useCompleteProfileMock.customer
    )
  })
})
