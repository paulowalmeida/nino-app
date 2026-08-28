import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SettingsDeliverySection } from './SettingsDeliverySection'
import { deliveryZoneMock } from './ZoneList/ZoneList.mock'

const delivery = vi.hoisted(() => ({
  add: { mutate: vi.fn(), isPending: false },
  edit: { mutate: vi.fn() },
  toggle: { mutate: vi.fn() },
  drop: { mutate: vi.fn() },
}))

vi.mock('@pages/Settings/facades/useSettingsFacade/useSettingsFacade', () => ({
  useSettingsFacade: () => ({
    delivery: {
      query: { zones: [deliveryZoneMock], isPending: false },
      mutations: delivery,
    },
  }),
}))

describe('SettingsDeliverySection', () => {
  it('composes the delivery flow and confirms a removal', async () => {
    const user = userEvent.setup()

    render(<SettingsDeliverySection />)

    expect(screen.getByRole('heading', { name: 'Entrega por região' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Adicionar região' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remover' }))
    expect(delivery.drop.mutate).not.toHaveBeenCalled()

    const dialog = await screen.findByRole('dialog')
    await user.click(
      within(dialog).getByRole('button', { name: 'Remover região' })
    )

    expect(delivery.drop.mutate).toHaveBeenCalledWith(deliveryZoneMock.id)
  })
})
