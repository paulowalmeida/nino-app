import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useAccountLayoutFacade } from './useAccountLayoutFacade'
import { useAccountLayoutFacadeMock } from './useAccountLayoutFacade.mock'

vi.mock('@shared/hooks/useConsumerSession/useConsumerSession')

describe('useAccountLayoutFacade', () => {
  it('exposes the consumer identity used by the account shell', () => {
    vi.mocked(useConsumerSession).mockReturnValue({
      consumer: useAccountLayoutFacadeMock.consumer,
    } as never)

    const { result } = renderHook(() => useAccountLayoutFacade())

    expect(result.current.consumer).toBe(useAccountLayoutFacadeMock.consumer)
  })
})
