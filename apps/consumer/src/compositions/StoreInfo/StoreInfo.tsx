import { Drawer } from '@nino/ds/components/Drawer'
import { storeWeekSchedule } from '@adapters/storeWeekSchedule.adapter'
import { useIsDesktop } from '@hooks/useIsDesktop'
import { displayName } from '@utils/store-info'
import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import type { Store } from '@custom_types/store/store'

import styles from './StoreInfo.module.css'

type StoreInfoProps = {
  store: Store
  hours: PublicOpeningHours[]
  estimatedMinutes?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * O que estava atrás de "Ver mais": onde a loja fica e quando ela atende.
 * São as duas perguntas que a vitrine não responde e que decidem se vale
 * pedir — por isso ficam a um toque do nome, não num rodapé.
 */
export const StoreInfo = ({
  store,
  hours,
  estimatedMinutes,
  open,
  onOpenChange,
}: StoreInfoProps) => {
  const isDesktop = useIsDesktop()
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
      <div className={styles.body}>
        <section>
          <h3 className={styles.label}>Endereço</h3>
          <p className={styles.value}>{address}</p>
          <p className={styles.sub}>{city}</p>
        </section>

        {estimatedMinutes ? (
          <section>
            <h3 className={styles.label}>Tempo de entrega</h3>
            <p className={styles.value}>~{estimatedMinutes} min</p>
          </section>
        ) : null}

        <section>
          <h3 className={styles.label}>Horários</h3>
          <ul className={styles.hours}>
            {week.map(({ day, timeLabel, isToday }) => (
              <li key={day} className={isToday ? styles.rowToday : styles.row}>
                <span>{day}</span>
                <span className={styles.time}>{timeLabel}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Drawer>
  )
}
