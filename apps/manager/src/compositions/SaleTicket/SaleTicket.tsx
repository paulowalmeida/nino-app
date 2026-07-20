import { Button, Input } from '@nino/ds'

import type { OrderChannel } from '@custom_types/order'
import { brl } from '@utils/money'
import { CHANNEL_LABEL, paymentLabelFor } from '@utils/order-flow'

import type { SaleTicketProps } from './SaleTicket.types'

import styles from './SaleTicket.module.css'
import motion from '@styles/motion.module.css'

const CHANNELS: OrderChannel[] = ['COUNTER', 'PICKUP']

/**
 * A comanda do caixa fica sempre à vista, com o total em corpo grande: é o
 * número que o operador fala em voz alta antes de receber.
 */
export const SaleTicket = ({
  lines,
  methods,
  customerName,
  tableNumber,
  onCustomerName,
  onTableNumber,
  channel,
  method,
  isSending,
  failed,
  onStep,
  onChannel,
  onMethod,
  onClear,
  onFinish,
}: SaleTicketProps) => {
  const total = lines.reduce(
    (sum, line) => sum + Number(line.unitPrice) * line.quantity,
    0
  )
  const count = lines.reduce((sum, { quantity }) => sum + quantity, 0)

  return (
    <aside className={styles.ticket}>
      <header className={styles.head}>
        <h2 className={styles.title}>Venda</h2>
        {count > 0 && (
          <button type="button" className={styles.clear} onClick={onClear}>
            Limpar
          </button>
        )}
      </header>

      {/* sem nome, a comanda pronta vira "de quem é esse pedido?" */}
      <div className={styles.who}>
        <Input
          placeholder="Nome de quem pediu"
          aria-label="Nome de quem pediu"
          className={styles.whoName}
          value={customerName}
          onChange={(event) => onCustomerName(event.target.value)}
        />
        <Input
          placeholder="Mesa"
          aria-label="Mesa ou comanda"
          className={styles.whoTable}
          value={tableNumber}
          onChange={(event) => onTableNumber(event.target.value)}
        />
      </div>

      {lines.length === 0 ? (
        <p className={styles.empty}>
          Toque nos itens para montar a venda.
        </p>
      ) : (
        <ul className={styles.lines}>
          {lines.map((line) => (
            <li key={line.productId} className={`${motion.deal} ${styles.line}`}>
              <span className={styles.lineName}>{line.name}</span>
              <div className={styles.stepper}>
                <button
                  type="button"
                  className={styles.step}
                  aria-label={`Tirar um ${line.name}`}
                  onClick={() => onStep(line.productId, -1)}
                >
                  −
                </button>
                <span className={styles.quantity}>{line.quantity}</span>
                <button
                  type="button"
                  className={styles.step}
                  aria-label={`Mais um ${line.name}`}
                  onClick={() => onStep(line.productId, 1)}
                >
                  +
                </button>
              </div>
              <span className={styles.linePrice}>
                {brl(Number(line.unitPrice) * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.foot}>
        <div className={styles.choices}>
          {CHANNELS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={channel === value}
              onClick={() => onChannel(value)}
              className={`${motion.press} ${styles.choice} ${
                channel === value ? styles.choiceOn : ''
              }`}
            >
              {CHANNEL_LABEL[value]}
            </button>
          ))}
        </div>

        <div className={styles.choices}>
          {methods.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={method === value}
              onClick={() => onMethod(value)}
              className={`${motion.press} ${styles.choice} ${
                method === value ? styles.choiceOn : ''
              }`}
            >
              {paymentLabelFor(value, channel)}
            </button>
          ))}
        </div>

        <div className={styles.total}>
          <span className={styles.totalLabel}>
            {count} {count === 1 ? 'item' : 'itens'}
          </span>
          <span className={styles.totalValue}>{brl(total)}</span>
        </div>

        {failed && (
          <p className={styles.error}>
            Não foi possível fechar a venda. Tente de novo.
          </p>
        )}

        <Button
          size="lg"
          loading={isSending}
          disabled={lines.length === 0}
          className={`${motion.press} ${styles.finish}`}
          onClick={onFinish}
        >
          Fechar venda
        </Button>
      </div>
    </aside>
  )
}
