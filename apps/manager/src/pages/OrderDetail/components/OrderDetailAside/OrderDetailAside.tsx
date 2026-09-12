import { OrderActions } from '@pages/OrderDetail/components/OrderDetailAside/OrderActions/OrderActions'
import { OrderConsumerBlock } from '@pages/OrderDetail/components/OrderDetailAside/OrderConsumerBlock/OrderConsumerBlock'
import { OrderPaymentBlock } from '@pages/OrderDetail/components/OrderDetailAside/OrderPaymentBlock/OrderPaymentBlock'
import { OrderProgressBlock } from '@pages/OrderDetail/components/OrderDetailAside/OrderProgressBlock/OrderProgressBlock'

import styles from './OrderDetailAside.module.css'

export const OrderDetailAside = () => (
  <div className={styles.aside}>
    <OrderConsumerBlock />
    <OrderPaymentBlock />
    <OrderProgressBlock />
    <OrderActions />
  </div>
)
