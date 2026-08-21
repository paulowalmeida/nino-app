import { EmptyState } from '@nino/ds/components/EmptyState'
import { Box } from '@nino/ds/components/Box'
import { ListRow } from '@nino/ds/components/ListRow'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { AddressLines } from '@molecules/AddressLines/AddressLines'
import type { CustomerAddress } from '@custom_types/customer/customer-address'

import styles from './CustomerAddresses.module.css'

type CustomerAddressesProps = {
  addresses: CustomerAddress[]
}

/** O endereço de entrega que vale abre a lista; os outros seguem abaixo. */
const primaryFirst = (addresses: CustomerAddress[]): CustomerAddress[] =>
  [...addresses].sort(
    (one, other) => Number(other.isPrimary) - Number(one.isPrimary)
  )

export const CustomerAddresses = ({ addresses }: CustomerAddressesProps) => {
  if (addresses.length === 0) {
    return <EmptyState>Nenhum endereço registrado ainda.</EmptyState>
  }

  return (
    <ScrollArea className={styles.scroll}>
      <Box as="ul" gap={0}>
        {primaryFirst(addresses).map((address, index) => (
          <ListRow
            key={address.id}
            align="start"
            divider={index === 0 ? 'none' : 'top'}
          >
            <AddressLines address={address} />
          </ListRow>
        ))}
      </Box>
    </ScrollArea>
  )
}
