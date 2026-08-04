import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useZoneMutations } from '@hooks/settings/useZoneMutations'
import { DeliveryZoneService } from '@services/delivery-zone.service'

import { zonesPage } from './useDeliveryZones.mock'

vi.mock('@services/delivery-zone.service')
vi.mock('@nino/ds/components/Toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useZoneMutations.name, () => {
  it('creates a zone and invalidates the list', async () => {
    // Arrange
    vi.mocked(DeliveryZoneService.createDeliveryZone).mockResolvedValue(
      zonesPage.data[0]
    )
    const client = new QueryClient()
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useZoneMutations('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.add.mutate({ name: 'Centro', fee: 5 })

    // Assert
    await waitFor(() => expect(invalidateSpy).toHaveBeenCalled())
  })

  it('removes a zone', async () => {
    // Arrange
    vi.mocked(DeliveryZoneService.removeDeliveryZone).mockResolvedValue({
      message: 'ok',
    })
    const client = new QueryClient()
    const { result } = renderHook(() => useZoneMutations('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.drop.mutate('zone-1')

    // Assert
    await waitFor(() => expect(result.current.drop.isSuccess).toBe(true))
    expect(DeliveryZoneService.removeDeliveryZone).toHaveBeenCalledWith(
      'tenant-1',
      'zone-1'
    )
  })

  it('reports failure when the mutation rejects', async () => {
    // Arrange
    vi.mocked(DeliveryZoneService.updateDeliveryZone).mockRejectedValue(
      new Error('network error')
    )
    const client = new QueryClient()
    const { result } = renderHook(() => useZoneMutations('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.toggle.mutate({ id: 'zone-1', isActive: false })

    // Assert
    await waitFor(() => expect(result.current.toggle.isError).toBe(true))
  })
})
