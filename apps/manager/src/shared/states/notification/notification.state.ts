import { create } from 'zustand'

import { PLACEHOLDER_NOTIFICATIONS } from '@shared/constants/notification-placeholder.constants'
import type { ManagerNotification } from '@shared/types/notification/manager-notification.type'

type NotificationState = {
  notifications: ManagerNotification[]
  markRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
}

const readNow = (notification: ManagerNotification): ManagerNotification =>
  notification.readAt
    ? notification
    : { ...notification, readAt: new Date().toISOString() }

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: PLACEHOLDER_NOTIFICATIONS,
  markRead: (id) =>
    set(({ notifications }) => ({
      notifications: notifications.map((notification) =>
        notification.id === id ? readNow(notification) : notification
      ),
    })),
  markAllRead: () =>
    set(({ notifications }) => ({ notifications: notifications.map(readNow) })),
  clearAll: () => set({ notifications: [] }),
}))

export const unreadCountOf = (notifications: ManagerNotification[]): number =>
  notifications.filter(({ readAt }) => !readAt).length
