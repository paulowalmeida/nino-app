import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsService } from '@shared/services/settings/settings.service'

import { useAcceptedPayments } from './useAcceptedPayments'
import { acceptedPaymentsMock } from './useAcceptedPayments.mock'

vi.mock('@shared/services/settings/settings.service', () => ({
  SettingsService: { getPublicSettings: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useAcceptedPayments.name, () => {
  it('returns configured methods', async () => {
    vi.mocked(SettingsService.getPublicSettings).mockResolvedValue({
      acceptedPaymentMethods: [...acceptedPaymentsMock],
    } as never)
    const { result } = renderHook(() => useAcceptedPayments('tenant-1'), {
      wrapper,
    })
    await waitFor(() =>
      expect(result.current.methods).toEqual(acceptedPaymentsMock)
    )
  })

  it('falls back to cash when no method is configured', () => {
    const { result } = renderHook(() => useAcceptedPayments(null), { wrapper })
    expect(result.current.methods).toEqual(['CASH'])
  })
})
