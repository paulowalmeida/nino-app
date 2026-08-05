import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { OpeningHours } from '@custom_types/settings/opening-hours'
import { useSaveWeek } from '@hooks/settings/useSaveWeek'
import { OpeningHoursService } from '@services/opening-hours.service'

import { existingDayDraft, newDayDraft } from './useSaveWeek.mock'

vi.mock('@services/opening-hours.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSaveWeek.name, () => {
  it('updates a day that already has an id', async () => {
    // Arrange
    vi.mocked(OpeningHoursService.updateOpeningHours).mockResolvedValue(
      {} as unknown as OpeningHours
    )
    const client = new QueryClient()
    const { result } = renderHook(() => useSaveWeek('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate([existingDayDraft])

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(OpeningHoursService.updateOpeningHours).toHaveBeenCalledWith(
      'tenant-1',
      'hours-1',
      {
        openTime: existingDayDraft.openTime,
        closeTime: existingDayDraft.closeTime,
        isOpen: existingDayDraft.isOpen,
      }
    )
  })

  it('creates a day that has no id yet', async () => {
    // Arrange
    vi.mocked(OpeningHoursService.createOpeningHours).mockResolvedValue(
      {} as unknown as OpeningHours
    )
    const client = new QueryClient()
    const { result } = renderHook(() => useSaveWeek('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate([newDayDraft])

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(OpeningHoursService.createOpeningHours).toHaveBeenCalledWith(
      'tenant-1',
      {
        dayOfWeek: newDayDraft.dayOfWeek,
        openTime: newDayDraft.openTime,
        closeTime: newDayDraft.closeTime,
        isOpen: newDayDraft.isOpen,
      }
    )
  })

  it('fails the batch when one day rejects', async () => {
    // Arrange
    vi.mocked(OpeningHoursService.updateOpeningHours).mockRejectedValue(
      new Error('network error')
    )
    const client = new QueryClient()
    const { result } = renderHook(() => useSaveWeek('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate([existingDayDraft])

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
