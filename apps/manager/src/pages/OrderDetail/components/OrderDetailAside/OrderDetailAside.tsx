import { OrderActions } from '@pages/OrderDetail/components/OrderDetailAside/OrderActions/OrderActions'
import { OrderCustomerBlock } from '@pages/OrderDetail/components/OrderDetailAside/OrderCustomerBlock/OrderCustomerBlock'
import { OrderPaymentBlock } from '@pages/OrderDetail/components/OrderDetailAside/OrderPaymentBlock/OrderPaymentBlock'
import { OrderProgressBlock } from '@pages/OrderDetail/components/OrderDetailAside/OrderProgressBlock/OrderProgressBlock'

import styles from './OrderDetailAside.module.css'

export const OrderDetailAside = () => (
  <div className={styles.aside}>
    <OrderCustomerBlock />
    <OrderPaymentBlock />
    <OrderProgressBlock />
    <OrderActions />
  </div>
)
