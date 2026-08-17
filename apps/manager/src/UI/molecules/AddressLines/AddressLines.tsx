import { Badge } from '@nino/ds/components/Badge'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { maskZipCode } from '@nino/ds/masks'
import type { CustomerAddress } from '@custom_types/customer/customer-address'

import styles from './AddressLines.module.css'

type AddressLinesProps = {
  address: CustomerAddress
}

const streetLineOf = (address: CustomerAddress): string =>
  [address.street, address.number].filter(Boolean).join(', ') +
  (address.complement ? ` — ${address.complement}` : '')

const cityLineOf = (address: CustomerAddress): string =>
  `${address.neighborhood} · ${address.city}/${address.state}`

/** Um endereço em duas linhas: onde é, e o resto que só confirma. */
export const AddressLines = ({ address }: AddressLinesProps) => (
  <div className={styles.address}>
    <Icon name="map-pin" className={styles.icon} aria-hidden />

    <div className={styles.lines}>
      <Text className={styles.streetLine}>
        {streetLineOf(address)}
        {address.isPrimary && (
          <Badge variant="brand" size="sm">
            Principal
          </Badge>
        )}
      </Text>
      <Text className={styles.cityLine}>
        {cityLineOf(address)} · CEP {maskZipCode(address.zipCode)}
      </Text>
    </div>
  </div>
)
