import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Icon, type IconName } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import type {
  ManagerNotification,
  ManagerNotificationKind,
} from '@shared/types/notification/manager-notification.type'
import { lastSeenLabel } from '@shared/utils/last-seen/last-seen'

import styles from './NotificationItem.module.css'

const KIND_ICON: Record<ManagerNotificationKind, IconName> = {
  order: 'bag',
  cash: 'banknote',
  team: 'users',
  promotion: 'tag',
}

type NotificationItemProps = {
  notification: ManagerNotification
  unitId: string | null
  onOpen: (id: string) => void
}

export const NotificationItem = ({
  notification: { id, kind, title, description, createdAt, readAt, path },
  unitId,
  onOpen,
}: NotificationItemProps) => (
  <Link
    to={`/${unitId}/${path}`}
    onClick={() => onOpen(id)}
    className={mergeClasses(styles.item, !readAt && styles.unread)}
  >
    <Box className={styles.iconTile} data-kind={kind}>
      <Icon name={KIND_ICON[kind]} size="sm" />
    </Box>
    <Box direction="column" className={styles.body}>
      <Text as="span" className={styles.title}>
        {title}
      </Text>
      <Text as="span" className={styles.description}>
        {description}
      </Text>
      <Text as="span" className={styles.time}>
        {lastSeenLabel(createdAt)}
      </Text>
    </Box>
    {!readAt && (
      <Text as="span" className={styles.unreadDot}>
        <Text as="span" className="sr-only">
          Não lida
        </Text>
      </Text>
    )}
  </Link>
)
