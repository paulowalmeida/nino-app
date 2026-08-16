import { Badge } from '@nino/ds/components/Badge'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { maskZipCode } from '@nino/ds/masks'
import type { CustomerAddress } from '@custom_types/customer/customer-address'
import { riseDelay } from '@utils/rise-delay'

import styles from './CustomerAddresses.module.css'
import motion from '@styles/motion.module.css'

type CustomerAddressesProps = {
  addresses: CustomerAddress[]
}

const streetLineOf = (address: CustomerAddress): string =>
  [address.street, address.number].filter(Boolean).join(', ') +
  (address.complement ? ` — ${address.complement}` : '')

const cityLineOf = (address: CustomerAddress): string =>
  `${address.neighborhood} · ${address.city}/${address.state}`

export const CustomerAddresses = ({ addresses }: CustomerAddressesProps) => (
  <section aria-label="Endereços registrados">
    <Text className={styles.eyebrow}>Endereços</Text>

    {addresses.length === 0 ? (
      <EmptyState size="sm" className={styles.empty}>
        Nenhum endereço registrado ainda.
      </EmptyState>
    ) : (
      <Flexbox as="ul" gap={3} className={styles.list}>
        {addresses.map((address, index) => (
          <li
            key={address.id}
            className={`${motion.settle} ${styles.addressItem}`}
            style={riseDelay(index * 50 + 60)}
          >
            <Icon name="map-pin" className={styles.icon} aria-hidden />

            <div className={styles.lines}>
              <Text className={styles.streetLine}>
                {streetLineOf(address)}
                {address.isPrimary && (
                  <Badge variant="brand" size="sm" className={styles.badge}>
                    Principal
                  </Badge>
                )}
              </Text>
              <Text className={styles.cityLine}>{cityLineOf(address)}</Text>
              <Text className={styles.zipCode}>
                CEP {maskZipCode(address.zipCode)}
              </Text>
            </div>
          </li>
        ))}
      </Flexbox>
    )}
  </section>
)
