import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { hoursKey } from '@shared/hooks/settings/useOpeningHours/useOpeningHours'
import { OpeningHoursService } from '@shared/services/opening-hours/opening-hours.service'
import type { OpeningHours } from '@shared/types/settings/opening-hours'

import { useSaveWeek } from './useSaveWeek'
import { newDayMock, savedDayMock, unitIdMock } from './useSaveWeek.mock'

vi.mock('@shared/services/opening-hours/opening-hours.service')

let client: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

describe(useSaveWeek.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    vi.mocked(OpeningHoursService.createOpeningHours).mockResolvedValue(
      savedDayMock as unknown as OpeningHours
    )
    vi.mocked(OpeningHoursService.updateOpeningHours).mockResolvedValue(
      savedDayMock as unknown as OpeningHours
    )
  })

  it('creates the day that has no record yet and updates the one that has', async () => {
    // Arrange
    const { result } = renderHook(() => useSaveWeek(unitIdMock), { wrapper })

    // Act
    result.current.mutate([newDayMock, savedDayMock])

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(OpeningHoursService.createOpeningHours).toHaveBeenCalledWith(
      unitIdMock,
      {
        dayOfWeek: newDayMock.dayOfWeek,
        openTime: newDayMock.openTime,
        closeTime: newDayMock.closeTime,
        isOpen: newDayMock.isOpen,
      }
    )
    expect(OpeningHoursService.updateOpeningHours).toHaveBeenCalledWith(
      unitIdMock,
      savedDayMock.id,
      {
        openTime: savedDayMock.openTime,
        closeTime: savedDayMock.closeTime,
        isOpen: savedDayMock.isOpen,
      }
    )
  })

  it('refreshes the week of that unit once every day is written', async () => {
    // Arrange
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useSaveWeek(unitIdMock), { wrapper })

    // Act
    result.current.mutate([savedDayMock])

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: hoursKey(unitIdMock),
    })
  })

  it('refreshes the empty key when no unit is open', async () => {
    // Arrange
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useSaveWeek(null), { wrapper })

    // Act
    result.current.mutate([savedDayMock])

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({ queryKey: hoursKey('') })
  })
})
