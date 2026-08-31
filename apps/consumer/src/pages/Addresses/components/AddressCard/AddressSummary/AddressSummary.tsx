import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import type { Address } from '@custom_types/address/address'
import {
  addressCityLine,
  addressStreetLine,
} from '@shared/utils/address-line/address-line'

import styles from './AddressSummary.module.css'

type AddressSummaryProps = { address: Address }

export const AddressSummary = ({ address }: AddressSummaryProps) => (
  <Box className={styles.body}>
    <Text className={styles.line}>{addressStreetLine(address)}</Text>
    <Text className={styles.city}>{addressCityLine(address)}</Text>
    {address.isPrimary && (
      <Badge size="sm" className={styles.badge}>
        Principal
      </Badge>
    )}
  </Box>
)
