import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { readLastOrder } from '@utils/last-order'

import { useCheckoutResume } from './useCheckoutResume'
import { useCheckoutResumeMock } from './useCheckoutResume.mock'

const navigate = vi.fn()
const storedOrder = (slug: string) => ({
  orderId: useCheckoutResumeMock.orderId,
  token: useCheckoutResumeMock.token,
  slug,
  createdAt: '2026-09-28T12:00:00.000Z',
  lastSeenEventAt: null,
  terminalAt: null,
  expiresAt: '2026-10-28T12:00:00.000Z',
})

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('@utils/last-order')

describe('useCheckoutResume', () => {
  beforeEach(() => vi.clearAllMocks())

  it('redirects an empty resolved checkout to the stored order from the same store', () => {
    vi.mocked(readLastOrder).mockReturnValue(
      storedOrder(useCheckoutResumeMock.pathSlug)
    )

    const { result } = renderHook(() =>
      useCheckoutResume({
        pathSlug: useCheckoutResumeMock.pathSlug,
        storeSlug: useCheckoutResumeMock.pathSlug,
        isStoreReady: true,
        created: undefined,
        cartItemCount: 0,
      })
    )

    expect(result.current?.orderId).toBe(useCheckoutResumeMock.orderId)
    expect(navigate).toHaveBeenCalledWith(
      '/loja-do-ze/pedido/order-1?token=token-1',
      { replace: true }
    )
  })

  it('does not treat the cart as empty before the current store resolves', () => {
    vi.mocked(readLastOrder).mockReturnValue(
      storedOrder(useCheckoutResumeMock.pathSlug)
    )

    renderHook(() =>
      useCheckoutResume({
        pathSlug: useCheckoutResumeMock.pathSlug,
        storeSlug: useCheckoutResumeMock.pathSlug,
        isStoreReady: false,
        created: undefined,
        cartItemCount: 0,
      })
    )

    expect(navigate).not.toHaveBeenCalled()
  })

  it('ignores a stored order that belongs to another store', () => {
    vi.mocked(readLastOrder).mockReturnValue(storedOrder('outra-loja'))

    const { result } = renderHook(() =>
      useCheckoutResume({
        pathSlug: useCheckoutResumeMock.pathSlug,
        storeSlug: useCheckoutResumeMock.pathSlug,
        isStoreReady: true,
        created: undefined,
        cartItemCount: 0,
      })
    )

    expect(result.current).toBeNull()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('keeps the current checkout when the cart has items', () => {
    vi.mocked(readLastOrder).mockReturnValue(
      storedOrder(useCheckoutResumeMock.pathSlug)
    )

    renderHook(() =>
      useCheckoutResume({
        pathSlug: useCheckoutResumeMock.pathSlug,
        storeSlug: useCheckoutResumeMock.pathSlug,
        isStoreReady: true,
        created: undefined,
        cartItemCount: 1,
      })
    )

    expect(navigate).not.toHaveBeenCalled()
  })
})
