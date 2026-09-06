import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'

import { useRequestPhoneLink } from './useRequestPhoneLink'
import { useRequestPhoneLinkMock } from './useRequestPhoneLink.mock'

vi.mock('@shared/services/customer-auth/customer-auth.service')

let mutationFn: ((input: unknown) => unknown) | undefined

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

describe('useRequestPhoneLink', () => {
  it('sends the phone to the link-request service', () => {
    // Arrange
    renderHook(() => useRequestPhoneLink())

    // Act
    mutationFn?.(useRequestPhoneLinkMock.request)

    // Assert
    expect(customerAuthService.requestPhoneLink).toHaveBeenCalledWith(
      useRequestPhoneLinkMock.request
    )
  })
})
