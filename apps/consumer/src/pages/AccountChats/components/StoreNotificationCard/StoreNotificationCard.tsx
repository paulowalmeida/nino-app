import { useEffect } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Icon, type IconName } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type {
  ConsumerNotification,
} from '@custom_types/notification/consumer-notification'

import styles from './StoreNotificationCard.module.css'

const notificationDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const iconByType: Record<string, IconName> = {
  PROMOTION: 'gift',
  USER: 'shield',
}

type StoreNotificationCardProps = {
  notification: ConsumerNotification
  onSeen: (id: string) => void
}

export const StoreNotificationCard = ({
  notification,
  onSeen,
}: StoreNotificationCardProps) => {
  const { id, title, body, readAt, createdAt, type } = notification

  useEffect(() => {
    if (readAt) return
    onSeen(id)
  }, [id, readAt, onSeen])

  return (
    <Box as="article" className={styles.card} aria-labelledby={`store-${id}`}>
      <Box direction="row" align="start" className={styles.main}>
        <Box className={styles.icon} aria-hidden="true">
          <Icon name={iconByType[type.name] ?? 'bell'} size="md" />
        </Box>
        <Box className={styles.copy}>
          <Box direction="row" align="center" className={styles.meta}>
            {!readAt && (
              <Text as="span" className={styles.unreadLabel}>
                Nova
              </Text>
            )}
          </Box>
          <Heading level={2} id={`store-${id}`} className={styles.title}>
            {title}
          </Heading>
          <Text as="p" className={styles.body}>
            {body}
          </Text>
          <time className={styles.time} dateTime={createdAt}>
            {notificationDate.format(new Date(createdAt))}
          </time>
        </Box>
      </Box>
    </Box>
  )
}
