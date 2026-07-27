import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { brl } from '@utils/money'
import { paymentLabelFor } from '@utils/order-flow'

import type { SaleTicketProps } from './SaleTicket.types'

import styles from './SaleTicket.module.css'
import motion from '@styles/motion.module.css'

/**
 * A comanda do caixa fica sempre à vista, com o total em corpo grande: é o
 * número que o operador fala em voz alta antes de receber.
 */
const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const SaleTicket = ({
  lines,
  methods,
  customerName,
  tableNumber,
  onCustomerName,
  onTableNumber,
  method,
  isSending,
  error,
  onStep,
  onMethod,
  onClear,
  onFinish,
  bare = false,
}: SaleTicketProps) => {
  const total = lines.reduce(
    (sum, line) => sum + Number(line.unitPrice) * line.quantity,
    0
  )
  const count = lines.reduce((sum, { quantity }) => sum + quantity, 0)

  return (
    <aside className={bare ? styles.ticketBare : styles.ticket}>
      <header className={bare ? styles.headBare : styles.head}>
        {!bare && <h2 className={styles.title}>Venda</h2>}
        {count > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={styles.clear}
            onClick={onClear}
          >
            <TrashIcon />
            Limpar comanda
          </Button>
        )}
      </header>

      {lines.length === 0 ? (
        <EmptyState>Toque nos itens para montar a venda.</EmptyState>
      ) : (
        <ul className={styles.lines}>
          {lines.map((line) => (
            <li
              key={line.productId}
              className={`${motion.deal} ${styles.line}`}
            >
              <span className={styles.lineName}>{line.name}</span>
              <div className={styles.lineControls}>
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
              </div>
            </li>
          ))}
        </ul>
      )}

      {/*
       * Identificação depois dos itens: o operador monta o pedido primeiro e
       * só então pergunta o nome. No topo, esses campos ocupavam o lugar do
       * assunto e empurravam a lista para baixo.
       */}
      {lines.length > 0 && (
        <div className={styles.who}>
          <Input
            placeholder="Nome de quem pediu"
            aria-label="Nome de quem pediu"
            value={customerName}
            onChange={(event) => onCustomerName(event.target.value)}
          />
          <Input
            placeholder="Mesa ou comanda"
            aria-label="Mesa ou comanda"
            value={tableNumber}
            onChange={(event) => onTableNumber(event.target.value)}
          />
        </div>
      )}

      <div className={styles.foot}>
        <p className={styles.payLabel}>Como vai pagar</p>

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
              {paymentLabelFor(value, 'COUNTER')}
            </button>
          ))}
        </div>

        <div className={styles.total}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>{brl(total)}</span>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

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
