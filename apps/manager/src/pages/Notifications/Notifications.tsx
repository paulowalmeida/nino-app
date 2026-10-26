import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Header } from '@nino/ds/components/Header'
import { Icon } from '@nino/ds/components/Icon'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import { Tabs } from '@nino/ds/components/Tabs'
import { NotificationItem } from '@shared/components/NotificationItem/NotificationItem'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import {
  unreadCountOf,
  useNotificationStore,
} from '@shared/states/notification/notification.state'

import styles from './Notifications.module.css'

type NotificationsTab = 'unread' | 'all'

export const Notifications = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const notifications = useNotificationStore((state) => state.notifications)
  const markRead = useNotificationStore((state) => state.markRead)
  const markAllRead = useNotificationStore((state) => state.markAllRead)
  const clearAll = useNotificationStore((state) => state.clearAll)
  const [tab, setTab] = useState<NotificationsTab>('unread')
  const [isClearConfirmOpen, setClearConfirmOpen] = useState(false)

  const unread = notifications.filter(({ readAt }) => !readAt)
  const unreadCount = unreadCountOf(notifications)
  const visible = tab === 'unread' ? unread : notifications

  const markAllReadItem: MenuItem = {
    value: 'mark-all-read',
    label: 'Marcar todas como lidas',
    disabled: unreadCount === 0,
    onSelect: markAllRead,
  }
  const clearItem: MenuItem = {
    value: 'clear',
    label: 'Limpar notificações',
    destructive: true,
    onSelect: () => setClearConfirmOpen(true),
  }

  return (
    <Box className={styles.notificationsPage}>
      <Header
        className={styles.header}
        title="Notificações"
        description="O que aconteceu na unidade e ainda pode pedir sua atenção."
      />

      <Box direction="row" align="center" gap={2} className={styles.toolbar}>
        <Tabs
          label="Filtrar notificações"
          className={styles.tabs}
          fullWidth={{ mobile: true, tablet: false }}
          value={tab}
          onValueChange={(value) => setTab(value as NotificationsTab)}
          tabs={[
            {
              value: 'unread',
              label: `Não lidas · ${unreadCount}`,
              content: null,
            },
            {
              value: 'all',
              label: `Todas · ${notifications.length}`,
              content: null,
            },
          ]}
        />

        {notifications.length > 0 && (
          <Box
            direction="row"
            align="center"
            gap={1}
            className={styles.bulkActions}
          >
            <Box direction="row" gap={1} className={styles.wideActions}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Marcar todas como lidas"
                title="Marcar todas como lidas"
                disabled={unreadCount === 0}
                onClick={markAllRead}
              >
                <Icon name="check-check" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Limpar notificações"
                title="Limpar notificações"
                className={styles.clear}
                onClick={() => setClearConfirmOpen(true)}
              >
                <Icon name="trash" />
              </Button>
            </Box>
            <Box className={styles.compactMenu}>
              <Menu
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Ações nas notificações"
                  >
                    <Icon name="kebab" />
                  </Button>
                }
                items={[markAllReadItem, { separator: true }, clearItem]}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Box className={styles.listScroll}>
        {visible.length > 0 ? (
          <Box direction="column" className={styles.list}>
            {visible.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                unitId={unitId}
                onOpen={markRead}
              />
            ))}
          </Box>
        ) : (
          <EmptyState
            title={
              tab === 'unread' ? 'Tudo em dia' : 'Nenhuma notificação ainda'
            }
            className={styles.empty}
          >
            Pedidos, caixa e equipe avisam aqui quando algo pede sua atenção.
          </EmptyState>
        )}
      </Box>

      <Dialog
        open={isClearConfirmOpen}
        onOpenChange={setClearConfirmOpen}
        title="Limpar notificações"
        description="Todas as notificações somem desta lista, inclusive as não lidas. Não dá para desfazer."
        confirmLabel="Limpar"
        onConfirm={() => {
          clearAll()
          setClearConfirmOpen(false)
        }}
        onCancel={() => setClearConfirmOpen(false)}
      />
    </Box>
  )
}
