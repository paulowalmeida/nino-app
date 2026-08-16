import { Flexbox } from '@nino/ds/components/Flexbox'
import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Dialog } from '@nino/ds/components/Dialog'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { Icon } from '@nino/ds/components/Icon'
import { ItemThumb } from '@components/ItemThumb/ItemThumb'
import { PAYMENT_METHOD_ICON } from '@constants/order.constants'
import type { CartLine } from '@custom_types/counter/cart-line'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import { brl } from '@utils/money'
import { paymentLabelFor } from '@utils/order-flow'

import styles from './SaleTicket.module.css'
import motion from '@styles/motion.module.css'

export type SaleTicketProps = {
  lines: CartLine[]
  /** Who will pick up the order once it's ready. */
  customerName: string
  tableNumber: string
  onCustomerName: (name: string) => void
  onTableNumber: (table: string) => void
  /** Methods the unit accepts, coming from the store's rules. */
  methods: PaymentMethod[]
  method: PaymentMethod
  isSending: boolean
  error: string | null
  onStep: (productId: string, by: number) => void
  onMethod: (method: PaymentMethod) => void
  onClear: () => void
  onFinish: () => void
  /**
   * Inside the mobile sheet the frame and the title belong to the sheet
   * itself — repeating them here would be a box inside a box.
   */
  bare?: boolean
}

/**
 * The counter's ticket, in the same shape as the customer app's cart: a row
 * with photo, name and running total on the left; value and quantity
 * stacked on the right. This is what lets the name fit on a narrow screen —
 * with the counter next to the name, it used to be the first thing
 * squeezed.
 *
 * What the counter has on top: who ordered, payment method and closing the
 * sale.
 */
export const SaleTicket = ({
  lines,
  customerName,
  tableNumber,
  onCustomerName,
  onTableNumber,
  methods,
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
    (sum, { unitPrice, quantity }) => sum + Number(unitPrice) * quantity,
    0
  )
  const count = lines.reduce((sum, { quantity }) => sum + quantity, 0)
  const [confirmingClear, setConfirmingClear] = useState(false)

  const handleConfirmClear = () => {
    setConfirmingClear(false)
    onClear()
  }

  return (
    <aside className={bare ? styles.ticketBare : styles.ticket}>
      {!bare && (
        <header className={styles.head}>
          <h2 className={styles.title}>Venda</h2>
        </header>
      )}

      <div className={styles.body}>
        {lines.length === 0 ? (
          <EmptyState className={styles.empty}>
            Toque nos itens para montar a venda.
          </EmptyState>
        ) : (
          <ScrollArea className={styles.linesScroll}>
            <ul className={styles.lines}>
              {lines.map((line) => {
                const isLast = line.quantity === 1

                return (
                  <li
                    key={line.productId}
                    className={`${motion.deal} ${styles.line}`}
                  >
                    <ItemThumb name={line.name} className={styles.photo} />

                    <div className={styles.lineText}>
                      <span className={styles.lineName}>{line.name}</span>
                      <span className={styles.lineMath}>
                        {line.quantity} × {brl(line.unitPrice)}
                      </span>
                    </div>

                    <Flexbox direction="column" gap={1.5} align="end" shrink={false}>
                      <span className={styles.lineTotal}>
                        {brl(Number(line.unitPrice) * line.quantity)}
                      </span>

                      <Flexbox
                        direction="row"
                        gap={1.5}
                        align="center"
                        shrink={false}
                      >
                        <Button
                          size="icon"
                          variant={isLast ? 'danger' : 'outline'}
                          className={styles.stepperBtn}
                          aria-label={
                            isLast
                              ? `Tirar ${line.name} da comanda`
                              : `Tirar um ${line.name}`
                          }
                          onClick={() => onStep(line.productId, -1)}
                        >
                          {/* On the last unit the dash turns into a trash
                            icon: tapping again removes it, and the icon
                            warns beforehand. */}
                          {isLast ? (
                            <Icon name="trash-thin" />
                          ) : (
                            <Icon name="minus" />
                          )}
                        </Button>

                        <span className={styles.stepperCount}>
                          {line.quantity}
                        </span>

                        <Button
                          size="icon"
                          variant="outline"
                          className={styles.stepperBtn}
                          aria-label={`Mais um ${line.name}`}
                          onClick={() => onStep(line.productId, 1)}
                        >
                          <Icon name="plus" />
                        </Button>
                      </Flexbox>
                    </Flexbox>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        )}

        {/*
         * Identification after the items: at the counter the order is
         * assembled before anyone asks for the name, and at the top these
         * fields used to push the list down.
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

            {/*
             * Payment lives here, not in the fixed footer: it's filler like
             * the name, and pinned at the bottom it used to take up half
             * the phone screen — space the item list needs.
             */}
            <p className={styles.payLabel}>Como vai pagar</p>

            <div className={styles.choices}>
              {methods.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="ghost"
                  aria-pressed={method === value}
                  onClick={() => onMethod(value)}
                  className={`${motion.press} ${styles.choice} ${
                    method === value ? styles.choiceOn : ''
                  }`}
                >
                  <Icon name={PAYMENT_METHOD_ICON[value]} />
                  {paymentLabelFor(value, 'COUNTER')}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <Flexbox align="baseline" justify="between">
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.total}>{brl(total)}</span>
          </Flexbox>

          {error && <Alert variant="error">{error}</Alert>}

          <Button
            loading={isSending}
            disabled={lines.length === 0}
            className={`${motion.press} ${styles.finish}`}
            onClick={onFinish}
          >
            Fechar venda
          </Button>

          {count > 0 && (
            <Button
              type="button"
              variant="ghost"
              className={styles.clear}
              onClick={() => setConfirmingClear(true)}
            >
              Limpar comanda
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={confirmingClear}
        onOpenChange={(open) => !open && setConfirmingClear(false)}
        title="Limpar a comanda?"
        description={'Os itens da venda serão removidos. Não dá para desfazer.'}
        confirmLabel="Limpar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmClear}
        onCancel={() => setConfirmingClear(false)}
      />
    </aside>
  )
}
