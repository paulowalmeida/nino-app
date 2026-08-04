import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { OpeningHoursService } from '@services/opening-hours.service'

import { mondayHoursPage } from './useOpeningHours.mock'

vi.mock('@services/opening-hours.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useOpeningHours.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists the hours for the given tenant', async () => {
    // Arrange
    vi.mocked(OpeningHoursService.listOpeningHours).mockResolvedValue(
      mondayHoursPage
    )
    const client = new QueryClient()

    // Act
    const { result } = renderHook(() => useOpeningHours('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    await waitFor(() =>
      expect(result.current.hours).toEqual(mondayHoursPage.data)
    )
  })

  it('returns an empty list with no tenant', () => {
    // Arrange / Act
    const client = new QueryClient()
    const { result } = renderHook(() => useOpeningHours(null), {
      wrapper: wrapWithClient(client),
    })

    // Assert
    expect(result.current.hours).toEqual([])
    expect(OpeningHoursService.listOpeningHours).not.toHaveBeenCalled()
  })
})
