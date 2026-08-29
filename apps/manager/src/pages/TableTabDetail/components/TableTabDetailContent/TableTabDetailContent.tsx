import { Link } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import type { Order } from '@shared/types/order/order'
import { brl } from '@shared/utils/money/money'

import styles from './TableTabDetailContent.module.css'

type TableTabDetailContentProps = {
  order?: Order
  isPending: boolean
  isError: boolean
}

export const TableTabDetailContent = ({
  order,
  isPending,
  isError,
}: TableTabDetailContentProps) => (
  <Box className={styles.page}>
    <Link to=".." relative="path" className={styles.back}>
      ← Voltar para comandas
    </Link>
    {isPending && <Text color="muted">Carregando comanda…</Text>}
    {isError && (
      <Alert variant="error">
        Não foi possível carregar esta comanda. Tente novamente.
      </Alert>
    )}
    {!isPending && !isError && !order && (
      <Alert variant="info">Esta comanda não está mais aberta.</Alert>
    )}
    {!isPending && !isError && order && (
      <>
        <Header
          title={order.tableNumber || order.guestName || 'Comanda'}
          accent="Comanda"
          description="Confira os itens e feche a conta quando o cliente pedir."
        />
        <Box className={styles.summary}>
          <Text size="sm" color="muted">
            Comanda #{order.orderNumber}
          </Text>
          <Text weight="bold" size="lg">
            {brl(Number(order.totalAmount))}
          </Text>
        </Box>
        <Box as="ul" className={styles.items}>
          {order.items.map((item) => (
            <ListRow key={item.id} divider="bottom">
              <Text>
                {item.quantity}× {item.product.name}
              </Text>
              <Text weight="bold">
                {brl(Number(item.unitPrice) * item.quantity)}
              </Text>
            </ListRow>
          ))}
        </Box>
        <Button disabled>
          {order.paymentStatus === 'PAID'
            ? 'Conta encerrada'
            : 'Fechar conta — em breve'}
        </Button>
      </>
    )}
  </Box>
)
