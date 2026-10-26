import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { Consumer } from '@custom_types/consumer/consumer'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'

import { useVerifyPhoneLink } from './useVerifyPhoneLink'
import { useVerifyPhoneLinkMock } from './useVerifyPhoneLink.mock'

vi.mock('@shared/services/consumer-auth/consumer-auth.service')

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

describe('useVerifyPhoneLink', () => {
  it('sends the phone and code to the link-verify service', () => {
    // Arrange
    renderHook(() => useVerifyPhoneLink())

    // Act
    mutationFn?.(useVerifyPhoneLinkMock.request)

    // Assert
    expect(consumerAuthService.verifyPhoneLink).toHaveBeenCalledWith(
      useVerifyPhoneLinkMock.request
    )
  })

  it('caches the updated consumer as the current session on success', () => {
    // Arrange
    renderHook(() => useVerifyPhoneLink())

    // Act
    onSuccess?.(useVerifyPhoneLinkMock.consumer)

    // Assert
    expect(setQueryData).toHaveBeenCalledWith(
      queryKeys.session.all,
      useVerifyPhoneLinkMock.consumer
    )
  })
})
