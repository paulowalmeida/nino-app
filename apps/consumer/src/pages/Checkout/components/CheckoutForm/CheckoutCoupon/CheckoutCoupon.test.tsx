import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { CheckoutCoupon } from './CheckoutCoupon'
import { suggestedCouponMock } from './CheckoutCoupon.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')

const applyCouponCode = vi.fn()
const applyCoupon = vi.fn()
const removeCoupon = vi.fn()

const withFacade = (overrides: Record<string, unknown>) =>
  vi.mocked(useCheckoutFacade).mockReturnValue({
    coupon: undefined,
    isCouponEligible: false,
    isDelivery: true,
    couponSuggestions: [suggestedCouponMock],
    isAuthenticated: true,
    applyCouponCode,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon: false,
    couponError: undefined,
    ...overrides,
  } as never)

describe('CheckoutCoupon', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists the announced coupons for any customer and applies one with a tap', async () => {
    withFacade({ isAuthenticated: false })

    render(<CheckoutCoupon />)
    expect(
      screen.getByRole('heading', { name: 'Cupons e descontos' })
    ).toBeInTheDocument()
    expect(screen.getByText('Cupom VOLTA10')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(applyCoupon).toHaveBeenCalledWith(suggestedCouponMock)
  })

  it('names a code-free discount by the campaign name', () => {
    withFacade({
      couponSuggestions: [
        { ...suggestedCouponMock, code: null, name: 'Desconto de sexta' },
      ],
    })

    render(<CheckoutCoupon />)

    expect(screen.getByText('Desconto de sexta')).toBeInTheDocument()
  })

  it('lets a guest type the code, and Enter applies it instead of ordering', async () => {
    withFacade({ isAuthenticated: false })

    render(<CheckoutCoupon />)
    await userEvent.click(screen.getByText('Tenho um cupom'))
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Código do cupom' }),
      'frete ja{Enter}'
    )

    expect(applyCouponCode).toHaveBeenCalledWith('FRETEJA')
  })

  it('explains an unknown coupon', async () => {
    withFacade({
      isAuthenticated: false,
      couponError: 'Cupom inválido ou indisponível',
    })

    render(<CheckoutCoupon />)
    await userEvent.click(screen.getByText('Tenho um cupom'))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Cupom inválido ou indisponível'
    )
  })

  it('shows the applied coupon, warns when it does not apply yet, and removes it', async () => {
    withFacade({ coupon: suggestedCouponMock, isCouponEligible: false })

    render(<CheckoutCoupon />)

    expect(screen.getByText('Cupom VOLTA10')).toBeInTheDocument()
    expect(
      screen.getByText(/Ainda não vale para este pedido/)
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(removeCoupon).toHaveBeenCalled()
  })

  it('uses pickup context when an applied coupon is ineligible', () => {
    withFacade({
      coupon: suggestedCouponMock,
      isCouponEligible: false,
      isDelivery: false,
    })

    render(<CheckoutCoupon />)

    expect(
      screen.getByText(/confira o pedido mínimo e a retirada/)
    ).toBeInTheDocument()
  })
})
