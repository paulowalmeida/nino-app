import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSubscriptionInterest } from '../../hooks/useSubscriptionInterest/useSubscriptionInterest'
import { useSubscriptionInterestFacade } from './useSubscriptionInterestFacade'
import {
  failedInterestRequestMock,
  pendingInterestRequestMock,
} from './useSubscriptionInterestFacade.mock'

vi.mock('../../hooks/useSubscriptionInterest/useSubscriptionInterest')

describe(useSubscriptionInterestFacade.name, () => {
  it.each([pendingInterestRequestMock, failedInterestRequestMock])(
    'exposes the interest request state %#',
    (requestState) => {
      // Arrange
      const mutate = vi.fn()
      vi.mocked(useSubscriptionInterest).mockReturnValue({
        ...requestState,
        mutate,
      } as unknown as ReturnType<typeof useSubscriptionInterest>)

      // Act
      const { result } = renderHook(() => useSubscriptionInterestFacade())

      // Assert
      expect(result.current).toEqual({
        requestInterest: mutate,
        isRequestingInterest: requestState.isPending,
        isRequestInterestError: requestState.isError,
      })
    }
  )
})
