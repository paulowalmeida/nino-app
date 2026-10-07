import { Header } from '@nino/ds/components/Header'

import styles from '@pages/Orders/components/OrdersHeader/OrdersHeader.module.css'

export const OrdersHeader = () => (
  <Header
    mb={{ mobile: 3, desktop: 6 }}
    className={styles.ordersHeader}
    title="Pedidos"
    accent="Pedidos"
    description="Cada comanda mostra o próximo passo. Um toque move o pedido adiante."
  />
)
