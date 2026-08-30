import { jsPDF } from 'jspdf'

import type { SaleReceipt } from '@pages/Counter/types/SaleReceipt.type'
import {
  PAYMENT_METHOD_LABEL_BY_CHANNEL,
} from '@shared/constants/order.constants'
import { brl } from '@shared/utils/money/money'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

const closedAtLabel = (closedAt: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(closedAt))

const WIDTH_MM = 80
const MARGIN_MM = 6
const LINE_HEIGHT_MM = 5

/*
 * WHY: jsPDF não quebra linha sozinho — cada `text()` é uma linha fixa. Um
 * cursor `y` que soma a cada chamada é o jeito mais simples de empilhar o
 * recibo sem calcular a altura da página com antecedência.
 */
export const downloadSaleReceipt = (receipt: SaleReceipt): void => {
  const lineCount = 6 + receipt.lines.length + (receipt.receivedAmount ? 2 : 0)
  const heightMm = lineCount * LINE_HEIGHT_MM + MARGIN_MM * 2

  const doc = new jsPDF({
    unit: 'mm',
    format: [WIDTH_MM, heightMm],
  })
  doc.setFont('courier')

  let y = MARGIN_MM
  const write = (text: string) => {
    doc.text(text, MARGIN_MM, y)
    y += LINE_HEIGHT_MM
  }

  write('Recibo de venda')
  write(`#${ticketNumber(receipt.orderNumber)}`)
  write(closedAtLabel(receipt.closedAt))
  write('-'.repeat(30))

  receipt.lines.forEach((line) => {
    const lineTotal = Number(line.unitPrice) * line.quantity
    write(`${line.quantity}x ${line.name}`)
    write(`  ${brl(line.unitPrice)} = ${brl(lineTotal)}`)
  })

  write('-'.repeat(30))
  write(`Total: ${brl(receipt.total)}`)
  const methodLabel =
    PAYMENT_METHOD_LABEL_BY_CHANNEL.COUNTER[receipt.paymentMethod]
  write(`Pagamento: ${methodLabel}`)

  if (receipt.receivedAmount !== null) {
    write(`Valor recebido: ${brl(receipt.receivedAmount)}`)
    write(`Troco: ${brl(receipt.changeAmount)}`)
  }

  doc.save(`recibo-${ticketNumber(receipt.orderNumber)}.pdf`)
}
