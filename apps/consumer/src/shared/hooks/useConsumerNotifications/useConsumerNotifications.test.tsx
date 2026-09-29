import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  notificationService,
} from '@shared/services/notification/notification.service'

import { useConsumerNotifications } from './useConsumerNotifications'
import { useConsumerNotificationsMock } from './useConsumerNotifications.mock'

vi.mock('@shared/services/notification/notification.service')

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useConsumerNotifications', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists the notifications once enabled', async () => {
    // Arrange
    vi.mocked(notificationService.listMine).mockResolvedValue(
      useConsumerNotificationsMock.notifications
    )

    // Act
    const { result } = renderHook(() => useConsumerNotifications(true), {
      wrapper,
    })

    // Assert
    await waitFor(() =>
      expect(result.current.data).toEqual(
        useConsumerNotificationsMock.notifications
      )
    )
  })

  it('stays disabled while there is no consumer session', () => {
    // Arrange
    // Act
    const { result } = renderHook(() => useConsumerNotifications(false), {
      wrapper,
    })

    // Assert
    expect(notificationService.listMine).not.toHaveBeenCalled()
    expect(result.current.isPending).toBe(true)
  })

  it('marks a notification read and refreshes the list', async () => {
    // Arrange
    vi.mocked(notificationService.listMine).mockResolvedValue([])
    vi.mocked(notificationService.markRead).mockResolvedValue({
      message: 'Marked as read',
    })
    const { result } = renderHook(() => useConsumerNotifications(true), {
      wrapper,
    })
    await waitFor(() => expect(result.current.isPending).toBe(false))

    // Act
    result.current.markRead('notification-1')

    // Assert
    await waitFor(() =>
      expect(notificationService.markRead).toHaveBeenCalledWith(
        'notification-1'
      )
    )
  })
})
