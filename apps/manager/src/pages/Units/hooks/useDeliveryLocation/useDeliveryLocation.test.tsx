import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LocationService } from '@pages/Units/services/LocationService/LocationService'

import { useDeliveryLocation } from './useDeliveryLocation'
import {
  deliveryMunicipalitiesMock,
  deliveryStatesMock,
} from './useDeliveryLocation.mock'

vi.mock('@pages/Units/services/LocationService/LocationService', () => ({
  LocationService: {
    listStates: vi
      .fn()
      .mockResolvedValue([{ id: 15, sigla: 'PA', nome: 'Pará' }]),
    listMunicipalities: vi
      .fn()
      .mockResolvedValue([{ id: 1501402, nome: 'Belém' }]),
  },
}))

describe('useDeliveryLocation', () => {
  it('loads states and municipalities for the selected UF', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useDeliveryLocation('PA'), { wrapper })

    await waitFor(() =>
      expect(result.current.municipalities.data).toEqual(
        deliveryMunicipalitiesMock
      )
    )
    expect(result.current.states.data).toEqual(deliveryStatesMock)
    expect(LocationService.listMunicipalities).toHaveBeenCalledWith('PA')
  })

  it('falls back to the unit UF before a different UF is selected', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    renderHook(() => useDeliveryLocation('', 'PA'), { wrapper })

    await waitFor(() =>
      expect(LocationService.listMunicipalities).toHaveBeenCalledWith('PA')
    )
  })
})
