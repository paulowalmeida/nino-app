import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSettings } from '@hooks/settings/useSettings'
import { SettingsService } from '@services/settings.service'

import { baseSettings } from './useSettings.mock'

vi.mock('@services/settings.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSettings.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches settings for the given tenant', async () => {
    // Arrange
    vi.mocked(SettingsService.getSettings).mockResolvedValue(baseSettings)
    const client = new QueryClient()

    // Act
    const { result } = renderHook(() => useSettings('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(baseSettings))
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const client = new QueryClient()
    const { result } = renderHook(() => useSettings(null), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(SettingsService.getSettings).not.toHaveBeenCalled()
  })
})
