import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { readLastOrder } from '@utils/last-order'

import { useCheckoutResume } from './useCheckoutResume'
import { useCheckoutResumeMock } from './useCheckoutResume.mock'

const navigate = vi.fn()

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('@utils/last-order')

describe('useCheckoutResume', () => {
  it('redirects an empty checkout to the stored order', () => {
    vi.mocked(readLastOrder).mockReturnValue({
      orderId: useCheckoutResumeMock.orderId,
      token: useCheckoutResumeMock.token,
      slug: useCheckoutResumeMock.pathSlug,
    })

    const { result } = renderHook(() =>
      useCheckoutResume(useCheckoutResumeMock.pathSlug, undefined, 0)
    )

    expect(result.current?.orderId).toBe(useCheckoutResumeMock.orderId)
    expect(navigate).toHaveBeenCalledWith(
      '/loja-do-ze/pedido/order-1?token=token-1',
      { replace: true }
    )
  })
})
