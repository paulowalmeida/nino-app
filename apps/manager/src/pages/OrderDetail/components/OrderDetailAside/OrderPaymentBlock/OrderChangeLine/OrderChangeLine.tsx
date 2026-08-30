import { Text } from '@nino/ds/components/Text'
import type { Order } from '@shared/types/order/order'
import { changeDue } from '@shared/utils/change-due/change-due'
import { brl } from '@shared/utils/money/money'

import styles from './OrderChangeLine.module.css'

export type OrderChangeLineProps = {
  order: Order
}

/*
 * WHY: o mesmo `changeFor` significa coisas diferentes conforme o canal. Na
 * entrega é uma promessa — o entregador ainda precisa sair com troco. No balcão
 * o dinheiro já está na mão de quem atende, e mandar "levar troco" para um
 * pedido pago no caixa é instrução errada.
 */
export const OrderChangeLine = ({ order }: OrderChangeLineProps) => {
  if (!order.changeFor) return null

  const received = Number(order.changeFor)
  const change = changeDue(received, Number(order.totalAmount))

  return (
    <Text as="p" size="sm" color="muted" className={styles.change}>
      {order.channel === 'COUNTER'
        ? `Recebido ${brl(received)} · troco ${brl(change.amount)}`
        : `Levar troco para ${brl(received)}`}
    </Text>
  )
}
