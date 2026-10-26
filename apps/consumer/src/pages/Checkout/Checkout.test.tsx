import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacadeValue } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { useCheckoutResume } from '@pages/checkout/hooks/useCheckoutResume/useCheckoutResume'

import { Checkout } from './Checkout'
import { checkoutMock } from './Checkout.mock'

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }))

vi.mock('react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => navigate,
  useParams: () => ({ slug: checkoutMock.pathSlug }),
}))
vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('@pages/checkout/hooks/useCheckoutResume/useCheckoutResume')
vi.mock('@pages/checkout/components/CheckoutForm/CheckoutForm', () => ({
  CheckoutForm: () => <div>checkout form</div>,
}))
vi.mock('@pages/checkout/components/OrderConfirmed/OrderConfirmed', () => ({
  OrderConfirmed: ({ onTrack }: { onTrack: () => void }) => (
    <button onClick={onTrack}>Acompanhar pedido</button>
  ),
}))
vi.mock('@pages/checkout/skeletons/CheckoutSkeleton/CheckoutSkeleton', () => ({
  CheckoutSkeleton: () => <div>loading</div>,
}))

describe('Checkout', () => {
  it('shows the empty-bag direction when there is no active order', () => {
    const setSlug = vi.fn()
    vi.mocked(useCheckoutFacadeValue).mockReturnValue({
      store: { id: 'store-1', company: { name: 'Bistrô do Zé' } },
      isStorePending: false,
      cartLines: [],
      created: undefined,
      setSlug,
      isHoursPending: false,
      hours: [],
    } as never)
    vi.mocked(useCheckoutResume).mockReturnValue(null)

    render(<Checkout />)

    expect(screen.getByText('Sua sacola está vazia')).toBeInTheDocument()
    expect(setSlug).toHaveBeenCalledWith(checkoutMock.pathSlug)
  })

  it('tracks an authenticated order without adding an undefined token', async () => {
    vi.mocked(useCheckoutFacadeValue).mockReturnValue({
      store: { id: 'store-1', company: { name: 'Bistrô do Zé' } },
      isStorePending: false,
      cartLines: [],
      created: {
        id: 'order-1',
        trackingToken: undefined,
      },
      setSlug: vi.fn(),
      isHoursPending: false,
      hours: [],
    } as never)
    vi.mocked(useCheckoutResume).mockReturnValue(null)

    render(<Checkout />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Acompanhar pedido' })
    )

    expect(navigate).toHaveBeenCalledWith('/loja-do-ze/pedido/order-1')
  })
})
