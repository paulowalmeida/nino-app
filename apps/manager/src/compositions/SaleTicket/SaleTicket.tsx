import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Dialog } from '@nino/ds/components/Dialog'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { Icon } from '@components/Icon/Icon'
import { ItemThumb } from '@components/ItemThumb'
import { brl } from '@utils/money'
import { paymentLabelFor } from '@utils/order-flow'
import minusIcon from '@assets/icons/minus.svg?raw'
import plusIcon from '@assets/icons/plus.svg?raw'

import type { SaleTicketProps } from './SaleTicket.types'

import styles from './SaleTicket.module.css'
import motion from '@styles/motion.module.css'

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

/**
 * A comanda do caixa, na mesma forma da sacola do app do cliente: linha com
 * foto, nome e a conta aberta à esquerda; valor e quantidade empilhados à
 * direita. É o que faz o nome caber em tela estreita — com o contador ao lado
 * do nome, ele era o primeiro a ser espremido.
 *
 * O que o balcão tem a mais: quem pediu, forma de pagamento e o fechamento.
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

                  <div className={styles.lineRight}>
                    <span className={styles.lineTotal}>
                      {brl(Number(line.unitPrice) * line.quantity)}
                    </span>

                    <div className={styles.stepper}>
                      <Button
                        size="icon"
                        variant="outline"
                        className={styles.stepperBtn}
                        aria-label={
                          isLast
                            ? `Tirar ${line.name} da comanda`
                            : `Tirar um ${line.name}`
                        }
                        onClick={() => onStep(line.productId, -1)}
                      >
                        {/* Na última unidade o traço vira lixeira: tocar de
                            novo remove, e o ícone avisa antes. */}
                        {isLast ? <TrashIcon /> : <Icon svg={minusIcon} />}
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
                        <Icon svg={plusIcon} />
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/*
         * Identificação depois dos itens: no balcão o pedido é montado antes
         * de se perguntar o nome, e no topo esses campos empurravam a lista.
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
             * Pagamento fica aqui, e não no rodapé fixo: é preenchimento como
             * o nome, e preso embaixo tomava metade da tela do celular, que é
             * espaço que a lista de itens precisa.
             */}
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
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.total}>{brl(total)}</span>
          </div>

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

      {confirmingClear && (
        <Dialog
          open
          onOpenChange={(open) => !open && setConfirmingClear(false)}
          title="Limpar a comanda?"
          description="Os itens da venda serão removidos. Não dá para desfazer."
          confirmLabel="Limpar"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmClear}
          onCancel={() => setConfirmingClear(false)}
        />
      )}
    </aside>
  )
}
