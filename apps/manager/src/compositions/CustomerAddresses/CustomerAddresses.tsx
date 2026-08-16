import { Badge } from '@nino/ds/components/Badge'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { maskZipCode } from '@nino/ds/masks'
import type { CustomerAddress } from '@custom_types/customer/customer-address'
import { riseDelay } from '@utils/rise-delay'

import styles from './CustomerAddresses.module.css'
import motion from '@styles/motion.module.css'

type CustomerAddressesProps = {
  addresses: CustomerAddress[]
}

const lineOf = (address: CustomerAddress): string =>
  [address.street, address.number].filter(Boolean).join(', ') +
  (address.complement ? ` — ${address.complement}` : '')

const cityLineOf = (address: CustomerAddress): string =>
  `${address.neighborhood} · ${address.city}/${address.state}`

export const CustomerAddresses = ({ addresses }: CustomerAddressesProps) => (
  <section aria-label="Endereços registrados">
    <p className={styles.eyebrow}>Endereços</p>

    {addresses.length === 0 ? (
      <EmptyState size="sm" className={styles.empty}>
        Nenhum endereço registrado ainda.
      </EmptyState>
    ) : (
      <ul className={styles.list}>
        {addresses.map((address, index) => (
          <li
            key={address.id}
            className={`${motion.settle} ${styles.item}`}
            style={riseDelay(index * 50 + 60)}
          >
            <Icon name="map-pin" className={styles.icon} aria-hidden />

            <div className={styles.lines}>
              <p className={styles.line}>
                {lineOf(address)}
                {address.isPrimary && (
                  <Badge variant="brand" size="sm" className={styles.badge}>
                    Principal
                  </Badge>
                )}
              </p>
              <p className={styles.cityLine}>{cityLineOf(address)}</p>
              <p className={styles.zipCode}>
                CEP {maskZipCode(address.zipCode)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
)
