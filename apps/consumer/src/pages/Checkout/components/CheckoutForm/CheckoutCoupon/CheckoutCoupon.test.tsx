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

  it('suggests the announced coupon to a signed-in customer with one tap', async () => {
    withFacade({})

    render(<CheckoutCoupon />)
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }))

    expect(screen.getByText('Você tem o cupom VOLTA10')).toBeInTheDocument()
    expect(applyCoupon).toHaveBeenCalledWith(suggestedCouponMock)
  })

  it('lets a guest type the code, and Enter applies it instead of ordering', async () => {
    withFacade({ isAuthenticated: false })

    render(<CheckoutCoupon />)
    expect(screen.queryByText(/Você tem o cupom/)).not.toBeInTheDocument()

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
})
