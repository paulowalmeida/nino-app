import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

import { CheckoutCouponsDrawer } from './CheckoutCouponsDrawer'
import {
  availableCouponMock,
  blockedCouponMock,
} from './CheckoutCouponsDrawer.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')

const applyCoupon = vi.fn()
const applyCouponCode = vi.fn()
const onOpenChange = vi.fn()

const withFacade = (overrides: Record<string, unknown> = {}) =>
  vi.mocked(useCheckoutFacade).mockReturnValue({
    coupon: undefined,
    couponBlockerOf: ({ id }: PublicPromotion) =>
      id === blockedCouponMock.id
        ? { kind: 'minimum', missing: 10, progress: 67 }
        : null,
    couponSuggestions: [availableCouponMock, blockedCouponMock],
    zones: [],
    applyCouponCode,
    applyCoupon,
    isApplyingCoupon: false,
    couponError: undefined,
    ...overrides,
  } as never)

const renderOpen = () =>
  render(<CheckoutCouponsDrawer open onOpenChange={onOpenChange} />)

describe('CheckoutCouponsDrawer', () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens a coupon detail and applies it from there, closing the panel', async () => {
    withFacade()
    renderOpen()

    await userEvent.click(screen.getByRole('button', { name: /Cupom VOLTA10/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar cupom' }))

    expect(applyCoupon).toHaveBeenCalledWith(availableCouponMock)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not let the customer apply a coupon that does not apply yet', async () => {
    withFacade()
    renderOpen()

    await userEvent.click(
      screen.getByRole('tab', { name: 'Indisponíveis (1)' })
    )
    await userEvent.click(
      screen.getByRole('button', { name: /Desconto no X-Tudo/ })
    )

    expect(screen.getByRole('button', { name: 'Aplicar cupom' })).toBeDisabled()
    expect(screen.getAllByText(/Faltam R\$\s10,00 para usar/).length).toBeGreaterThan(0)
    expect(applyCoupon).not.toHaveBeenCalled()
  })

  it('marks the coupon already in the order', () => {
    withFacade({ coupon: availableCouponMock })
    renderOpen()

    expect(screen.getByText('Aplicado')).toBeInTheDocument()
  })

  it('lets the customer type a code, and Enter applies it instead of ordering', async () => {
    withFacade()
    renderOpen()

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Código do cupom' }),
      'frete ja{Enter}'
    )

    expect(applyCouponCode).toHaveBeenCalledWith('FRETEJA')
  })

  it('explains an unknown code', () => {
    withFacade({ couponError: 'Cupom inválido ou indisponível' })
    renderOpen()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Cupom inválido ou indisponível'
    )
  })
})
