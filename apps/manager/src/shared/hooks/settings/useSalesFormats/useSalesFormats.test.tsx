import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SettingsService } from '@shared/services/settings/settings.service'

import { useSalesFormats } from './useSalesFormats'
import {
  counterOnlyStoreMock,
  everyFormatEnabledMock,
  noFormatEnabledMock,
  tenantIdMock,
} from './useSalesFormats.mock'

vi.mock('@shared/services/settings/settings.service', () => ({
  SettingsService: { getPublicSettings: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe('useSalesFormats', () => {
  afterEach(() => vi.clearAllMocks())

  it('lists every format the store has enabled', async () => {
    // Arrange
    vi.mocked(SettingsService.getPublicSettings).mockResolvedValue(
      everyFormatEnabledMock
    )

    // Act
    const { result } = renderHook(() => useSalesFormats(tenantIdMock), {
      wrapper,
    })

    // Assert
    await waitFor(() =>
      expect(result.current.formats).toEqual(['DELIVERY', 'PICKUP', 'COUNTER'])
    )
  })

  it('lists one format when the store sells only at the counter', async () => {
    // Arrange
    vi.mocked(SettingsService.getPublicSettings).mockResolvedValue(
      counterOnlyStoreMock
    )

    // Act
    const { result } = renderHook(() => useSalesFormats(tenantIdMock), {
      wrapper,
    })

    // Assert
    await waitFor(() => expect(result.current.formats).toEqual(['COUNTER']))
  })

  it('falls back to delivery when the store enabled nothing', async () => {
    // Arrange
    vi.mocked(SettingsService.getPublicSettings).mockResolvedValue(
      noFormatEnabledMock
    )

    // Act
    const { result } = renderHook(() => useSalesFormats(tenantIdMock), {
      wrapper,
    })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.formats).toEqual(['DELIVERY'])
  })

  it('does not request the settings without a store in context', () => {
    // Act
    const { result } = renderHook(() => useSalesFormats(null), { wrapper })

    // Assert
    expect(SettingsService.getPublicSettings).not.toHaveBeenCalled()
    expect(result.current.formats).toEqual(['DELIVERY'])
  })
})
