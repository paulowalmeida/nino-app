import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAcceptedPayments } from '@hooks/settings/useAcceptedPayments'
import { SettingsService } from '@services/settings.service'

import { noneConfigured, pixAndCard } from './useAcceptedPayments.mock'

vi.mock('@services/settings.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useAcceptedPayments.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns the tenant configured methods', async () => {
    // Arrange
    vi.mocked(SettingsService.getAcceptedPayments).mockResolvedValue(
      pixAndCard
    )

    // Act
    const { result } = renderHook(() => useAcceptedPayments('tenant-1'), {
      wrapper: wrapWithClient(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(result.current.methods).toEqual(['PIX', 'CARD_ONLINE'])
  })

  it('falls back to cash when nothing is configured', async () => {
    // Arrange
    vi.mocked(SettingsService.getAcceptedPayments).mockResolvedValue(
      noneConfigured
    )

    // Act
    const { result } = renderHook(() => useAcceptedPayments('tenant-1'), {
      wrapper: wrapWithClient(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(result.current.methods).toEqual(['CASH'])
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(() => useAcceptedPayments(null), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(SettingsService.getAcceptedPayments).not.toHaveBeenCalled()
  })
})
