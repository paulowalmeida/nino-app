import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'
import { notificationService } from './notification.service'
import { notificationServiceMock } from './notification.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('notificationService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists the logged consumer notifications', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue([
      notificationServiceMock.notification,
    ])

    // Act
    const result = await notificationService.listMine()

    // Assert
    expect(api.get).toHaveBeenCalledWith('my/notifications')
    expect(result).toEqual([notificationServiceMock.notification])
  })

  it('marks a notification as read by id', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue({ message: 'Marked as read' })

    // Act
    const result = await notificationService.markRead('notification-1')

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      'my/notifications/notification-1/read',
      undefined
    )
    expect(result).toEqual({ message: 'Marked as read' })
  })
})
