import { Tabs } from '@nino/ds/components/Tabs'
import { ConsumerAddresses } from '@pages/ConsumerDetail/components/ConsumerWorkspace/ConsumerAddresses/ConsumerAddresses'
import { ConsumerOrderHistory } from '@pages/ConsumerDetail/components/ConsumerWorkspace/ConsumerOrderHistory/ConsumerOrderHistory'
import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
import { consumerTabLabel } from '@pages/ConsumerDetail/utils/consumerTabLabel/consumerTabLabel'

import styles from './ConsumerWorkspace.module.css'

export const ConsumerWorkspace = () => {
  const { consumer, addressRows } = useConsumerDetailFacade()

  if (!consumer) return null

  return (
    <Tabs
      className={styles.panels}
      tabs={[
        {
          value: 'orders',
          label: consumerTabLabel('Pedidos', consumer.orders),
          content: <ConsumerOrderHistory />,
        },
        {
          value: 'addresses',
          label: consumerTabLabel('Endereços', addressRows.length),
          content: <ConsumerAddresses />,
        },
      ]}
    />
  )
}
