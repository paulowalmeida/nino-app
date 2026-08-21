import { Box } from '@nino/ds/components/Box'
import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Icon } from '@nino/ds/components/Icon'
import { ListRow } from '@nino/ds/components/ListRow'
import { QuantityStepper } from '@nino/ds/components/QuantityStepper'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { ItemThumb } from '@atoms/ItemThumb/ItemThumb'
import { PAYMENT_METHOD_ICON } from '@constants/order.constants'
import type { CartLine } from '@custom_types/counter/cart-line'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import { brl } from '@utils/money'
import { paymentLabelFor } from '@utils/order-flow'

import styles from './SaleTicket.module.css'
import motion from '@styles/motion.module.css'

export type SaleTicketProps = {
  lines: CartLine[]
  customerName: string
  tableNumber: string
  onCustomerName: (name: string) => void
  onTableNumber: (table: string) => void
  methods: PaymentMethod[]
  method: PaymentMethod
  isSending: boolean
  error: string | null
  onStep: (productId: string, by: number) => void
  onMethod: (method: PaymentMethod) => void
  onClear: () => void
  onFinish: () => void
  bare?: boolean
}

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
    <Box as="aside" className={bare ? styles.ticketBare : styles.ticket}>
      {!bare && (
        <Box as="header" direction="row" className={styles.head}>
          <Heading level={2} size="lg" className={styles.title}>
            Venda
          </Heading>
        </Box>
      )}

      <Box className={styles.body}>
        {lines.length === 0 ? (
          <EmptyState className={styles.empty}>
            Toque nos itens para montar a venda.
          </EmptyState>
        ) : (
          <ScrollArea className={styles.linesScroll}>
            <Box as="ul" className={styles.lines}>
              {lines.map((line) => {
                const isLast = line.quantity === 1

                return (
                  <ListRow
                    key={line.productId}
                    divider="top"
                    gap={2.5}
                    padding={3}
                    className={mergeClasses(motion.deal, styles.line)}
                  >
                    <ItemThumb name={line.name} className={styles.photo} />

                    <Box className={styles.lineText}>
                      <Text as="span" size="sm" weight="semibold" className={styles.lineName}>
                        {line.name}
                      </Text>
                      <Text as="span" size="xs" color="muted" className={styles.lineMath}>
                        {line.quantity} × {brl(line.unitPrice)}
                      </Text>
                    </Box>

                    <Box direction="column" gap={1.5} align="end" shrink={false}>
                      <Text
                        as="span"
                        size="sm"
                        weight="extrabold"
                        font="display"
                        className={styles.lineTotal}
                      >
                        {brl(Number(line.unitPrice) * line.quantity)}
                      </Text>

                      <QuantityStepper
                        quantity={line.quantity}
                        decrementIcon={isLast ? 'trash' : 'minus'}
                        decrementVariant={isLast ? 'danger' : 'outline'}
                        decrementLabel={
                          isLast
                            ? `Tirar ${line.name} da comanda`
                            : `Tirar um ${line.name}`
                        }
                        incrementLabel={`Mais um ${line.name}`}
                        onDecrement={() => onStep(line.productId, -1)}
                        onIncrement={() => onStep(line.productId, 1)}
                        size="sm"
                        className={styles.stepper}
                        count={
                          <Text as="span" size="sm" weight="bold" className={styles.stepperCount}>
                          {line.quantity}
                          </Text>
                        }
                      />
                    </Box>
                  </ListRow>
                )
              })}
            </Box>
          </ScrollArea>
        )}

        {lines.length > 0 && (
          <Box className={styles.who}>
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

            <Text
              size="xs"
              weight="bold"
              case="uppercase"
              color="faint"
              className={styles.payLabel}
            >
              Como vai pagar
            </Text>

            <Box className={styles.choices}>
              {methods.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="ghost"
                  aria-pressed={method === value}
                  onClick={() => onMethod(value)}
                  className={mergeClasses(
                    motion.press,
                    styles.choice,
                    method === value && styles.choiceOn
                  )}
                >
                  <Icon name={PAYMENT_METHOD_ICON[value]} />
                  {paymentLabelFor(value, 'COUNTER')}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        <Box className={styles.footer}>
          <Box align="baseline" justify="between">
            <Text as="span" size="sm" weight="semibold" color="muted" className={styles.totalLabel}>
              Total
            </Text>
            <Text as="span" size="2xl" weight="extrabold" font="display" className={styles.total}>
              {brl(total)}
            </Text>
          </Box>

          {error && <Alert variant="error">{error}</Alert>}

          <Button
            loading={isSending}
            disabled={lines.length === 0}
            className={mergeClasses(motion.press, styles.finish)}
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
        </Box>
      </Box>

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
    </Box>
  )
}
