import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useDeliveryZones } from '@hooks/settings/useDeliveryZones'
import { useZoneMutations } from '@hooks/settings/useZoneMutations'

import {
  SettingsDeliverySection,
} from '@pages/settings-delivery-section/SettingsDeliverySection'

import { activeZone, currentTenant } from './SettingsDeliverySection.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/settings/useDeliveryZones')
vi.mock('@hooks/settings/useZoneMutations')

describe(SettingsDeliverySection.name, () => {
  it('lists the delivery zones already registered', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useDeliveryZones).mockReturnValue({
      zones: [activeZone],
      isPending: false,
    } as unknown as ReturnType<typeof useDeliveryZones>)
    vi.mocked(useZoneMutations).mockReturnValue({
      add: { mutate: vi.fn(), isPending: false },
      edit: { mutate: vi.fn() },
      toggle: { mutate: vi.fn() },
      drop: { mutate: vi.fn() },
    } as unknown as ReturnType<typeof useZoneMutations>)

    // Act
    render(<SettingsDeliverySection />)

    // Assert
    expect(screen.getByText('Centro')).toBeInTheDocument()
  })

  it('turns delivery off for a zone', async () => {
    // Arrange
    const toggle = { mutate: vi.fn() }
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useDeliveryZones).mockReturnValue({
      zones: [activeZone],
      isPending: false,
    } as unknown as ReturnType<typeof useDeliveryZones>)
    vi.mocked(useZoneMutations).mockReturnValue({
      add: { mutate: vi.fn(), isPending: false },
      edit: { mutate: vi.fn() },
      toggle,
      drop: { mutate: vi.fn() },
    } as unknown as ReturnType<typeof useZoneMutations>)
    render(<SettingsDeliverySection />)

    // Act
    await userEvent.click(screen.getByRole('checkbox'))

    // Assert
    expect(toggle.mutate).toHaveBeenCalledWith({
      id: 'zone-1',
      isActive: false,
    })
  })
})
