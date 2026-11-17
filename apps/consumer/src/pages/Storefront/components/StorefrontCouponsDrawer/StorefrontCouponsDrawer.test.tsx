import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { StorefrontCouponsDrawer } from './StorefrontCouponsDrawer'
import {
  storefrontAvailableMock,
  storefrontBlockedMock,
} from './StorefrontCouponsDrawer.mock'

vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({ useStorefrontFacade: vi.fn() })
)

const setFocusedPromotionId = vi.fn()

const withFacade = (focusedPromotionId: string | null) =>
  vi.mocked(useStorefrontFacade).mockReturnValue({
    promotionPanelOffers: [storefrontAvailableMock, storefrontBlockedMock],
    couponBlockerOf: ({ id }: { id: string }) =>
      id === storefrontBlockedMock.id
        ? { kind: 'minimum', missing: 20, progress: 60 }
        : null,
    deliveryZones: [],
    focusedPromotionId,
    setFocusedPromotionId,
  } as never)

describe('StorefrontCouponsDrawer', () => {
  beforeEach(() => vi.clearAllMocks())

  it('stays closed until a card is tapped', () => {
    withFacade(null)

    render(<StorefrontCouponsDrawer />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens on the detail page of the tapped offer', async () => {
    withFacade(storefrontAvailableMock.id)

    render(<StorefrontCouponsDrawer />)

    expect(
      await screen.findByRole('dialog', { name: 'Detalhes do cupom' })
    ).toBeInTheDocument()
    expect(screen.getByText('Disponível para sua sacola')).toBeInTheDocument()
    expect(screen.getByText('Toda a área de entrega')).toBeInTheDocument()
  })

  it('does not offer to apply the coupon, only to go back to the menu', async () => {
    withFacade(storefrontBlockedMock.id)

    render(<StorefrontCouponsDrawer />)

    const action = await screen.findByRole('button', { name: 'Ver cardápio' })
    expect(action).toBeEnabled()
    expect(
      screen.getByText('Você escolhe o cupom na revisão do pedido.')
    ).toBeInTheDocument()

    await userEvent.click(action)
    expect(setFocusedPromotionId).toHaveBeenCalledWith(null)
  })

  it('clears the focused offer when the panel closes', async () => {
    withFacade(storefrontAvailableMock.id)

    render(<StorefrontCouponsDrawer />)
    await userEvent.click(await screen.findByLabelText('Fechar'))

    expect(setFocusedPromotionId).toHaveBeenCalledWith(null)
  })
})
