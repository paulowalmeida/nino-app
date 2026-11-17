import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { CheckoutCoupon } from './CheckoutCoupon'
import { suggestedCouponMock } from './CheckoutCoupon.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')

const removeCoupon = vi.fn()

const withFacade = (overrides: Record<string, unknown>) =>
  vi.mocked(useCheckoutFacade).mockReturnValue({
    coupon: undefined,
    isCouponEligible: false,
    couponBlockerOf: () => null,
    isDelivery: true,
    couponSuggestions: [suggestedCouponMock],
    applyCouponCode: vi.fn(),
    applyCoupon: vi.fn(),
    removeCoupon,
    isApplyingCoupon: false,
    couponError: undefined,
    ...overrides,
  } as never)

describe('CheckoutCoupon', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sums up how many coupons apply and opens the coupons panel', async () => {
    withFacade({})

    render(<CheckoutCoupon />)
    expect(screen.getByText('1 cupom disponível')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Ver cupons/ }))
    expect(
      await screen.findByRole('dialog', { name: 'Cupons' })
    ).toBeInTheDocument()
  })

  it('says when no coupon applies to the order yet', () => {
    withFacade({ couponBlockerOf: () => ({ kind: 'payment' }) })

    render(<CheckoutCoupon />)

    expect(
      screen.getByText('Nenhum cupom vale para este pedido')
    ).toBeInTheDocument()
  })

  it('shows the applied coupon with swap and remove', async () => {
    withFacade({ coupon: suggestedCouponMock, isCouponEligible: true })

    render(<CheckoutCoupon />)

    expect(screen.getByText('Cupom VOLTA10')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Trocar' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(removeCoupon).toHaveBeenCalled()
  })

  it('names the real reason on an applied coupon that stopped applying', () => {
    withFacade({
      coupon: suggestedCouponMock,
      couponBlockerOf: () => ({ kind: 'product', productName: 'X-Tudo' }),
    })

    render(<CheckoutCoupon />)

    expect(screen.getByText('Vale só no X-Tudo')).toBeInTheDocument()
  })

  it('falls back to the channel when the rule has no structured reason', () => {
    withFacade({ coupon: suggestedCouponMock, isDelivery: false })

    render(<CheckoutCoupon />)

    expect(screen.getByText(/confira a retirada/)).toBeInTheDocument()
  })
})
