import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { Consumer } from '@custom_types/consumer/consumer'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'

import { useCompleteProfile } from './useCompleteProfile'
import { useCompleteProfileMock } from './useCompleteProfile.mock'

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

describe('useCompleteProfile', () => {
  it('sends the profile fields to the update service', () => {
    // Arrange
    renderHook(() => useCompleteProfile())

    // Act
    mutationFn?.(useCompleteProfileMock.request)

    // Assert
    expect(consumerAuthService.updateMyProfile).toHaveBeenCalledWith(
      useCompleteProfileMock.request
    )
  })

  it('caches the updated consumer as the current session on success', () => {
    // Arrange
    renderHook(() => useCompleteProfile())

    // Act
    onSuccess?.(useCompleteProfileMock.consumer)

    // Assert
    expect(setQueryData).toHaveBeenCalledWith(
      queryKeys.session.all,
      useCompleteProfileMock.consumer
    )
  })
})
