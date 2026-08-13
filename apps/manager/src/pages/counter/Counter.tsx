import { Flexbox } from '@nino/ds/components/Flexbox'
import { useState } from 'react'

import { Drawer } from '@nino/ds/components/Drawer'
import { toast } from '@nino/ds/components/Toast'
import { ProductGrid } from '@compositions/ProductGrid/ProductGrid'
import { CouponTab } from '@compositions/CouponTab/CouponTab'
import { SaleTicket } from '@compositions/SaleTicket/SaleTicket'
import { useCreateOrder } from '@hooks/order/useCreateOrder'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useIsDesktop } from '@hooks/ui/useIsDesktop'
import { useMenu } from '@hooks/product/useMenu'
import { useAcceptedPayments } from '@hooks/settings/useAcceptedPayments'
import { ApiError } from '@nino/lib/utils/api-error'
import type { CartLine } from '@custom_types/counter/cart-line'
import type { MenuItem } from '@custom_types/product/menu-item'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import styles from './Counter.module.css'
import motion from '@styles/motion.module.css'

/**
 * O balcão: atender quem está na loja sem passar pelo resto do painel.
 * Alvos grandes, comanda sempre à vista e tela limpa a cada venda — quem
 * opera aqui repete o mesmo gesto o expediente inteiro.
 */
export const Counter = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { sections, isPending } = useMenu(tenantId)
  const { methods } = useAcceptedPayments(tenantId)
  const { mutateAsync: placeOrder, isPending: isSending } =
    useCreateOrder(tenantId)

  const [lines, setLines] = useState<CartLine[]>([])
  const [sheet, setSheet] = useState(false)
  const isDesktop = useIsDesktop()
  const [chosen, setChosen] = useState<PaymentMethod | null>(null)

  /** A escolha só vale enquanto a loja aceitar aquela forma. */
  const method = chosen && methods.includes(chosen) ? chosen : methods[0]
  const [customerName, setCustomerName] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [error, setError] = useState<string | null>(null)

  const pick = (item: MenuItem) =>
    setLines((current) => {
      const found = current.find(({ productId }) => productId === item.id)
      if (!found) {
        return [
          ...current,
          {
            productId: item.id,
            name: item.name,
            unitPrice: item.price,
            quantity: 1,
          },
        ]
      }
      return current.map((line) =>
        line.productId === item.id
          ? { ...line, quantity: line.quantity + 1 }
          : line
      )
    })

  const step = (productId: string, by: number) =>
    setLines((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + by }
            : line
        )
        .filter(({ quantity }) => quantity > 0)
    )

  const finish = async () => {
    setError(null)
    if (!customerName && !tableNumber) {
      setError('Informe o nome do cliente ou o número da mesa.')
      return
    }
    try {
      const order = await placeOrder({
        channel: 'COUNTER',
        paymentMethod: method,
        guestName: customerName || undefined,
        tableNumber: tableNumber || undefined,
        items: lines.map(({ productId, quantity, unitPrice }) => ({
          productId,
          quantity,
          unitPrice: Number(unitPrice),
        })),
      })
      setLines([])
      setCustomerName('')
      setTableNumber('')
      toast.success(`Venda #${order.id.slice(-4).toUpperCase()} fechada`)
    } catch (caught) {
      if (caught instanceof ApiError && caught.status < 500) {
        setError(caught.message)
        return
      }
      setError('Não foi possível fechar a venda. Tente de novo.')
    }
  }

  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce(
    (sum, line) => sum + Number(line.unitPrice) * line.quantity,
    0
  )

  const ticketFor = (bare: boolean) => (
    <SaleTicket
      bare={bare}
      lines={lines}
      methods={methods}
      customerName={customerName}
      tableNumber={tableNumber}
      onCustomerName={setCustomerName}
      onTableNumber={setTableNumber}
      method={method}
      isSending={isSending}
      error={error}
      onStep={step}
      onMethod={setChosen}
      onClear={() => {
        setLines([])
        setCustomerName('')
        setTableNumber('')
      }}
      onFinish={finish}
    />
  )

  return (
    <div className={styles.page}>
      <Flexbox as="header" direction="column" gap={1} shrink={false} mb={4} className={motion.deal}>
        <h1 className={styles.title}>Balcão</h1>
        <p className={styles.subtitle}>
          Monte o pedido de quem está na loja e feche a venda.
        </p>
      </Flexbox>

      <div className={styles.floor}>
        <section className={styles.menu} aria-label="Cardápio">
          <ProductGrid
            sections={sections}
            isPending={isPending}
            onPick={pick}
          />
        </section>

        {/* No desktop a comanda mora na coluna ao lado, sempre aberta. */}
        {isDesktop && ticketFor(false)}
      </div>

      {/*
       * No celular ela vira cupom: a ponta fica presa no rodapé com o total,
       * e puxar abre a comanda inteira. Sem isso, fechar a venda exigia rolar
       * o cardápio todo — com sessenta bebidas, três telas.
       */}
      {!isDesktop && count > 0 && (
        <CouponTab count={count} total={total} onOpen={() => setSheet(true)} />
      )}

      {/*
       * A folha fica montada mesmo no desktop e com a comanda vazia: quem
       * some com ela aberta — esvaziar a comanda, alargar a janela até o
       * desktop — deixa o bloqueio de ponteiro do Ark preso no body, e a
       * página inteira para de responder a clique até um F5.
       */}
      <Drawer
        open={sheet && !isDesktop && count > 0}
        onOpenChange={setSheet}
        placement="bottom"
        size="auto"
        title="Comanda"
        description={`${count} ${count === 1 ? 'item' : 'itens'}`}
        contentClassName={styles.sheet}
        bodyClassName={styles.sheetBody}
      >
        {ticketFor(true)}
      </Drawer>
    </div>
  )
}
