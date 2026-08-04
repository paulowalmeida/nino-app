import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDeliveryZones } from '@hooks/settings/useDeliveryZones'
import { DeliveryZoneService } from '@services/delivery-zone.service'

import { zonesPage } from './useDeliveryZones.mock'

vi.mock('@services/delivery-zone.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useDeliveryZones.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists zones for the given tenant', async () => {
    // Arrange
    vi.mocked(DeliveryZoneService.listDeliveryZones).mockResolvedValue(
      zonesPage
    )
    const client = new QueryClient()

    // Act
    const { result } = renderHook(() => useDeliveryZones('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.zones).toEqual(zonesPage.data))
  })

  it('returns an empty list with no tenant', () => {
    // Arrange / Act
    const client = new QueryClient()
    const { result } = renderHook(() => useDeliveryZones(null), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    expect(result.current.zones).toEqual([])
    expect(DeliveryZoneService.listDeliveryZones).not.toHaveBeenCalled()
  })
})
