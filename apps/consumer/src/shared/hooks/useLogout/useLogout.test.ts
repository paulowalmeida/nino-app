import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import { consumerAuthService } from '@shared/services/consumer-auth/consumer-auth.service'
import { forgetSession } from '@utils/session-hint'

import { useLogout } from './useLogout'
import { useLogoutMock } from './useLogout.mock'

vi.mock('@shared/services/consumer-auth/consumer-auth.service')
vi.mock('@utils/session-hint')

const setQueryData = vi.fn()
const removeQueries = vi.fn()

let onSuccess: (() => void) | undefined
let mutationFn: (() => unknown) | undefined

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueryClient: () => ({ setQueryData, removeQueries }),
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

describe('useLogout', () => {
  it('calls the logout service', () => {
    // Arrange
    renderHook(() => useLogout())

    // Act
    mutationFn?.()

    // Assert
    expect(consumerAuthService.logout).toHaveBeenCalled()
  })

  it('forgets the session hint and clears the session cache on success', () => {
    // Arrange
    renderHook(() => useLogout())

    // Act
    onSuccess?.()

    // Assert
    expect(forgetSession).toHaveBeenCalled()
    expect(setQueryData).toHaveBeenCalledWith(
      useLogoutMock.sessionCacheKey,
      null
    )
  })

  it('removes the orders and addresses caches on success', () => {
    // Arrange
    renderHook(() => useLogout())

    // Act
    onSuccess?.()

    // Assert
    expect(removeQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.myOrders.all,
    })
    expect(removeQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.myAddresses.all,
    })
  })
})
