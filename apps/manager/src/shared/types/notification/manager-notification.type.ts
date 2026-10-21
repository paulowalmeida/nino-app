export type ManagerNotificationKind =
  | 'order'
  | 'cash'
  | 'team'
  | 'promotion'

export type ManagerNotification = {
  id: string
  kind: ManagerNotificationKind
  title: string
  description: string
  createdAt: string
  readAt: string | null
  /** Seção da unidade que a notificação abre, sem o `/<unitId>` */
  path: string
}
