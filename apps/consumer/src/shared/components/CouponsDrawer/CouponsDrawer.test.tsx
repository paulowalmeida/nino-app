import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'

import { CouponsDrawer } from './CouponsDrawer'
import { drawerAvailableMock, drawerBlockedMock } from './CouponsDrawer.mock'

vi.mock('@shared/hooks/useStoreTint/useStoreTint', () => ({
  useStoreTint: () => undefined,
}))

const onOpenChange = vi.fn()
const onSelect = vi.fn()

const renderDrawer = (initialDetailId?: string | null) =>
  render(
    <CouponsDrawer
      open
      onOpenChange={onOpenChange}
      coupons={[drawerAvailableMock, drawerBlockedMock]}
      blockerOf={({ id }: PublicPromotion) =>
        id === drawerBlockedMock.id
          ? { kind: 'minimum', missing: 10, progress: 67 }
          : null
      }
      zones={[]}
      initialDetailId={initialDetailId}
      action={{ label: 'Aplicar cupom', disabledWhenBlocked: true, onSelect }}
      emptyAvailable="Nada disponível"
      emptyUnavailable="Nada indisponível"
    />
  )

describe('CouponsDrawer', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists the coupons in tabs, opening on the list', () => {
    renderDrawer()

    expect(screen.getByRole('dialog', { name: 'Cupons' })).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: 'Disponíveis (1)' })
    ).toBeInTheDocument()
    expect(screen.getByText('Cupom VOLTA10')).toBeInTheDocument()
  })

  it('opens the detail page of a tapped coupon and moves focus to Voltar', async () => {
    renderDrawer()

    await userEvent.click(screen.getByRole('button', { name: /Cupom VOLTA10/ }))

    expect(
      screen.getByRole('dialog', { name: 'Detalhes do cupom' })
    ).toBeInTheDocument()
    const back = screen.getByRole('button', { name: 'Cupons' })
    expect(back).toHaveFocus()
    expect(screen.getByText('Como usar')).toBeInTheDocument()
  })

  it('goes back to the list and returns focus to the coupon it came from', async () => {
    renderDrawer()
    await userEvent.click(screen.getByRole('button', { name: /Cupom VOLTA10/ }))

    await userEvent.click(screen.getByRole('button', { name: 'Cupons' }))

    expect(screen.getByRole('dialog', { name: 'Cupons' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cupom VOLTA10/ })).toHaveFocus()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('steps back on Escape from the detail and closes on Escape from the list', async () => {
    renderDrawer()
    await userEvent.click(screen.getByRole('button', { name: /Cupom VOLTA10/ }))

    await userEvent.keyboard('{Escape}')
    expect(screen.getByRole('dialog', { name: 'Cupons' })).toBeInTheDocument()
    expect(onOpenChange).not.toHaveBeenCalled()

    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('opens straight on a coupon detail and lands on its tab when going back', async () => {
    renderDrawer(drawerBlockedMock.id)

    expect(
      screen.getByRole('dialog', { name: 'Detalhes do cupom' })
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Cupons' }))

    expect(
      screen.getByRole('tab', { name: 'Indisponíveis (1)', selected: true })
    ).toBeInTheDocument()
  })

  it('runs the footer action with the coupon on the page', async () => {
    renderDrawer(drawerAvailableMock.id)

    await userEvent.click(screen.getByRole('button', { name: 'Aplicar cupom' }))

    expect(onSelect).toHaveBeenCalledWith(drawerAvailableMock)
    expect(
      within(screen.getByRole('dialog')).getByText('Disponível para sua sacola')
    ).toBeInTheDocument()
  })
})
