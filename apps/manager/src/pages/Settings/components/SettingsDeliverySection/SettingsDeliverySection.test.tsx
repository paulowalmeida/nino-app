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
    units: { detail: { data: undefined } },
  }),
}))

vi.mock('@shared/services/tenant/tenant.service', () => ({
  TenantService: { getMapLocation: vi.fn().mockResolvedValue(null) },
}))

describe('SettingsDeliverySection', () => {
  it('composes the delivery flow and confirms a removal', async () => {
    const user = userEvent.setup()

    render(<SettingsDeliverySection />)

    expect(
      screen.getByRole('heading', { name: 'Taxa por distância' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Adicionar faixa' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remover' }))
    expect(delivery.drop.mutate).not.toHaveBeenCalled()

    const dialog = await screen.findByRole('dialog')
    await user.click(
      within(dialog).getByRole('button', { name: 'Remover faixa' })
    )

    expect(delivery.drop.mutate).toHaveBeenCalledWith(deliveryZoneMock.id)
  })
})
