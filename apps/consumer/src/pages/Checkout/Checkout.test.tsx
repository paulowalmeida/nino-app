import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { useCheckoutResume } from '@pages/checkout/hooks/useCheckoutResume/useCheckoutResume'

import { Checkout } from './Checkout'
import { checkoutMock } from './Checkout.mock'

vi.mock('react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useParams: () => ({ slug: checkoutMock.pathSlug }),
}))
vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('@pages/checkout/hooks/useCheckoutResume/useCheckoutResume')
vi.mock('@pages/checkout/components/CheckoutForm/CheckoutForm', () => ({
  CheckoutForm: () => <div>checkout form</div>,
}))
vi.mock('@pages/checkout/components/OrderConfirmed/OrderConfirmed', () => ({
  OrderConfirmed: () => <div>confirmed</div>,
}))
vi.mock('@pages/checkout/skeletons/CheckoutSkeleton/CheckoutSkeleton', () => ({
  CheckoutSkeleton: () => <div>loading</div>,
}))

describe('Checkout', () => {
  it('shows the empty-bag direction when there is no active order', () => {
    const setSlug = vi.fn()
    vi.mocked(useCheckoutFacade).mockReturnValue({
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
})
