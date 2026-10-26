import { useState } from 'react'
import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { Popover } from '@nino/ds/components/Popover'
import { Text } from '@nino/ds/components/Text'
import { NotificationItem } from '@shared/components/NotificationItem/NotificationItem'
import {
  unreadCountOf,
  useNotificationStore,
} from '@shared/states/notification/notification.state'

import styles from './NotificationBell.module.css'

const PREVIEW_SIZE = 5

type NotificationBellProps = {
  unitId: string | null
}

export const NotificationBell = ({ unitId }: NotificationBellProps) => {
  const [open, setOpen] = useState(false)
  const notifications = useNotificationStore((state) => state.notifications)
  const markRead = useNotificationStore((state) => state.markRead)
  const markAllRead = useNotificationStore((state) => state.markAllRead)

  const unread = unreadCountOf(notifications)
  const preview = notifications.slice(0, PREVIEW_SIZE)

  const openNotification = (id: string) => {
    markRead(id)
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      placement="bottom-end"
      contentClassName={styles.panel}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className={styles.bellTrigger}
          aria-label={
            unread ? `Notificações, ${unread} não lidas` : 'Notificações'
          }
        >
          <Icon name="bell" size="md" />
          {unread > 0 && (
            <Text as="span" className={styles.badge} aria-hidden="true">
              {unread > 9 ? '9+' : unread}
            </Text>
          )}
        </Button>
      }
    >
      <Box direction="row" className={styles.panelHeader}>
        <Text as="span" className={styles.panelTitle}>
          Notificações
        </Text>
        {unread > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className={styles.markAll}
            onClick={markAllRead}
          >
            Marcar todas como lidas
          </Button>
        )}
      </Box>

      {preview.length ? (
        <Box direction="column" className={styles.list}>
          {preview.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              unitId={unitId}
              onOpen={openNotification}
            />
          ))}
        </Box>
      ) : (
        <EmptyState title="Nada por aqui ainda">
          Pedidos, caixa e equipe avisam aqui quando algo pede sua atenção.
        </EmptyState>
      )}

      <Link
        to={`/${unitId}/notificacoes`}
        onClick={() => setOpen(false)}
        className={styles.seeAll}
      >
        Ver todas as notificações
      </Link>
    </Popover>
  )
}
