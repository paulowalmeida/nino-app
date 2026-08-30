import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useAccountLayoutFacade } from './useAccountLayoutFacade'
import { useAccountLayoutFacadeMock } from './useAccountLayoutFacade.mock'

vi.mock('@shared/hooks/useCustomerSession/useCustomerSession')

describe('useAccountLayoutFacade', () => {
  it('exposes the customer identity used by the account shell', () => {
    vi.mocked(useCustomerSession).mockReturnValue({
      customer: useAccountLayoutFacadeMock.customer,
    } as never)

    const { result } = renderHook(() => useAccountLayoutFacade())

    expect(result.current.customer).toBe(useAccountLayoutFacadeMock.customer)
  })
})
