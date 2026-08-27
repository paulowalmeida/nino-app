import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { ListRow } from '@nino/ds/components/ListRow'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'

import styles from './CustomerAddresses.module.css'

export const CustomerAddresses = () => {
  const { addressRows } = useCustomerDetailFacade()

  if (addressRows.length === 0) {
    return <EmptyState>Nenhum endereço registrado ainda.</EmptyState>
  }

  return (
    <ScrollArea className={styles.scroll}>
      <Box as="ul" gap={0}>
        {addressRows.map((address, index) => (
          <ListRow
            key={address.id}
            align="start"
            divider={index === 0 ? 'none' : 'top'}
          >
            <div className={styles.address}>
              <Icon name="map-pin" size="sm" color="faint" />
              <div className={styles.lines}>
                <Text
                  size="sm"
                  weight="semibold"
                  color="strong"
                  className={styles.streetLine}
                >
                  {address.streetLine}
                  {address.isPrimary && (
                    <Badge variant="brand" size="sm">
                      Principal
                    </Badge>
                  )}
                </Text>
                <Text size="xs" color="subtle" className={styles.cityLine}>
                  {address.cityLine}
                </Text>
              </div>
            </div>
          </ListRow>
        ))}
      </Box>
    </ScrollArea>
  )
}
