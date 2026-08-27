import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
import { customerCadenceLabel } from '@pages/CustomerDetail/utils/customerCadenceLabel/customerCadenceLabel'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'

import motion from '@styles/motion.module.css'
import styles from './CustomerHeader.module.css'

export const CustomerHeader = () => {
  const { customer } = useCustomerDetailFacade()

  if (!customer) return null

  return (
    <Box
      as="header"
      direction="row"
      gap={4}
      align="center"
      className={`${motion.settle} ${styles.hero}`}
    >
      <PersonMark name={customer.name} className={styles.mark} />

      <Box className={styles.heroText}>
        <Eyebrow>Cliente</Eyebrow>
        <Heading level={1} size="xl" className={styles.name}>
          {customer.name}
        </Heading>
        <Text size="xs" color="faint" className={styles.cadence}>
          {customerCadenceLabel(customer.since, customer.lastOrderAt)}
        </Text>
      </Box>
    </Box>
  )
}
