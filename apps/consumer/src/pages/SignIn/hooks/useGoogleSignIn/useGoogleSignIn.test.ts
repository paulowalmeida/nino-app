import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { Customer } from '@custom_types/customer/customer'
import { customerAuthService } from '@shared/services/customer-auth/customer-auth.service'
import { rememberSession } from '@utils/session-hint'

import { useGoogleSignIn } from './useGoogleSignIn'
import { useGoogleSignInMock } from './useGoogleSignIn.mock'

vi.mock('@shared/services/customer-auth/customer-auth.service')
vi.mock('@utils/session-hint')

const setQueryData = vi.fn()

let onSuccess: ((customer: Customer) => void) | undefined
let mutationFn: ((idToken: string) => unknown) | undefined

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

describe('useGoogleSignIn', () => {
  it('sends the google credential to the sign-in service', () => {
    // Arrange
    renderHook(() => useGoogleSignIn())
    // Act
    mutationFn?.(useGoogleSignInMock.idToken)
    // Assert
    expect(customerAuthService.signInWithGoogle).toHaveBeenCalledWith(
      useGoogleSignInMock.idToken
    )
  })

  it('remembers the session and caches the customer on success', () => {
    // Arrange
    renderHook(() => useGoogleSignIn())
    // Act
    onSuccess?.(useGoogleSignInMock.customer)
    // Assert
    expect(rememberSession).toHaveBeenCalled()
    expect(setQueryData).toHaveBeenCalledWith(
      queryKeys.session.all,
      useGoogleSignInMock.customer
    )
  })
})
