import { Tabs } from '@nino/ds/components/Tabs'
import { CustomerAddresses } from '@pages/CustomerDetail/components/CustomerWorkspace/CustomerAddresses/CustomerAddresses'
import { CustomerOrderHistory } from '@pages/CustomerDetail/components/CustomerWorkspace/CustomerOrderHistory/CustomerOrderHistory'
import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
import { customerTabLabel } from '@pages/CustomerDetail/utils/customerTabLabel/customerTabLabel'

import styles from './CustomerWorkspace.module.css'

export const CustomerWorkspace = () => {
  const { customer, addressRows } = useCustomerDetailFacade()

  if (!customer) return null

  return (
    <Tabs
      className={styles.panels}
      tabs={[
        {
          value: 'orders',
          label: customerTabLabel('Pedidos', customer.orders),
          content: <CustomerOrderHistory />,
        },
        {
          value: 'addresses',
          label: customerTabLabel('Endereços', addressRows.length),
          content: <CustomerAddresses />,
        },
      ]}
    />
  )
}
