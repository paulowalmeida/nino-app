import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import { useSaveSettings } from '@hooks/settings/useSaveSettings'
import { SettingsService } from '@services/settings.service'

import { baseSettings, settingsUpdate } from './useSettings.mock'

vi.mock('@services/settings.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSaveSettings.name, () => {
  it('writes the returned settings straight into the cache', async () => {
    // Arrange
    const saved = { ...baseSettings, minOrderAmount: '35.00' }
    vi.mocked(SettingsService.saveSettings).mockResolvedValue(saved)
    const client = new QueryClient()
    const { result } = renderHook(() => useSaveSettings('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate(settingsUpdate)

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      client.getQueryData(queryKeys.tenant.settings('tenant-1'))
    ).toEqual(saved)
  })

  it('reports failure when the request rejects', async () => {
    // Arrange
    vi.mocked(SettingsService.saveSettings).mockRejectedValue(
      new Error('network error')
    )
    const client = new QueryClient()
    const { result } = renderHook(() => useSaveSettings('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate(settingsUpdate)

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
