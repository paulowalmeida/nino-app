import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'

import { useSaveServiceFee } from './useSaveServiceFee'
import { savedSettingsMock, unitIdMock } from './useSaveServiceFee.mock'

vi.mock('@shared/services/settings/settings.service')

let client: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

describe(useSaveServiceFee.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  it('writes the saved settings straight into the cache of that unit', async () => {
    // Arrange
    vi.mocked(SettingsService.saveSettings).mockResolvedValue(savedSettingsMock)
    const { result } = renderHook(() => useSaveServiceFee(unitIdMock), {
      wrapper,
    })

    // Act
    result.current.mutate(savedSettingsMock)

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(client.getQueryData(queryKeys.unit.settings(unitIdMock))).toEqual(
      savedSettingsMock
    )
  })

  it('caches under the empty key when no unit is open', async () => {
    // Arrange
    vi.mocked(SettingsService.saveSettings).mockResolvedValue(savedSettingsMock)
    const { result } = renderHook(() => useSaveServiceFee(null), { wrapper })

    // Act
    result.current.mutate(savedSettingsMock)

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(client.getQueryData(queryKeys.unit.settings(''))).toEqual(
      savedSettingsMock
    )
  })
})
