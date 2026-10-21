import { beforeEach, describe, expect, it } from 'vitest'

import { PLACEHOLDER_NOTIFICATIONS } from '@shared/constants/notification-placeholder.constants'

import { unreadCountOf, useNotificationStore } from './notification.state'

describe('notification state', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: PLACEHOLDER_NOTIFICATIONS })
  })

  it('marks a single notification as read', () => {
    const [first] = useNotificationStore.getState().notifications
    const before = unreadCountOf(useNotificationStore.getState().notifications)

    useNotificationStore.getState().markRead(first.id)

    expect(unreadCountOf(useNotificationStore.getState().notifications)).toBe(
      before - 1
    )
  })

  it('marks everything as read at once', () => {
    useNotificationStore.getState().markAllRead()

    expect(unreadCountOf(useNotificationStore.getState().notifications)).toBe(0)
  })

  it('clears every notification', () => {
    useNotificationStore.getState().clearAll()

    expect(useNotificationStore.getState().notifications).toHaveLength(0)
  })
})
