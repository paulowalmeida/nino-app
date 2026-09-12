import { NotificationType } from '../../enums'

export type ConsumerNotificationPreference = {
  id: string
  emailEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  createdAt: string
  updatedAt: string
  notificationType: { id: string; name: NotificationType }
}
