import { Drawer } from '@nino/ds/components/Drawer'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { Heading } from '@nino/ds/components/Heading'
import { ListRow } from '@nino/ds/components/ListRow'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { storeWeekSchedule } from '@pages/Storefront/adapters/storeWeekSchedule.adapter/storeWeekSchedule.adapter'
import { displayName } from '@utils/store-info'

import styles from './StoreInfo.module.css'

export const StoreInfo = () => {
  const {
    store,
    hours,
    estimatedMinutes,
    showAddressOnStoreInfo,
    isInfoOpen: open,
    setInfoOpen: onOpenChange,
    isDesktop,
  } = useStorefrontFacade()
  if (!store) return null
  const week = storeWeekSchedule(hours, new Date().getDay())

  const address = `${store.street}, ${store.number} — ${store.neighborhood}`
  const city = `${store.city}/${store.state}`

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      placement={isDesktop ? 'right' : 'bottom'}
      title={displayName(store)}
      size={isDesktop ? '25rem' : 'auto'}
    >
      <Box className={styles.body}>
        {showAddressOnStoreInfo ? (
          <Box as="section">
            <Heading level={3} className={styles.label}>
              Endereço
            </Heading>
            <Text className={styles.value}>{address}</Text>
            <Text className={styles.sub}>{city}</Text>
          </Box>
        ) : null}

        {estimatedMinutes ? (
          <Box as="section">
            <Heading level={3} className={styles.label}>
              Tempo de entrega
            </Heading>
            <Text className={styles.value}>~{estimatedMinutes} min</Text>
          </Box>
        ) : null}

        <Box as="section">
          <Heading level={3} className={styles.label}>
            Horários
          </Heading>
          <Box as="ul" className={styles.hours}>
            {week.map(({ day, timeLabel, isToday }) => (
              <ListRow
                key={day}
                className={isToday ? styles.rowToday : styles.row}
              >
                <Text as="span">{day}</Text>
                <Text as="span" className={styles.time}>
                  {timeLabel}
                </Text>
              </ListRow>
            ))}
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}
