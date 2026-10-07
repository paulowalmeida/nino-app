import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Dialog } from '@nino/ds/components/Dialog'
import { Heading } from '@nino/ds/components/Heading'
import { Label } from '@nino/ds/components/Label'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { Textarea } from '@nino/ds/components/Textarea'
import { cancellationDescription } from '@pages/TableTabDetail/utils/cancellationDescription/cancellationDescription'
import { BackLink } from '@shared/components/BackLink/BackLink'
import { PAYMENT_METHOD_LABEL } from '@shared/constants/order.constants'
import type { Order } from '@shared/types/order/order'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './TableTabDetailContent.module.css'

type TableTabDetailContentProps = {
  order?: Order
  isPending: boolean
  isError: boolean
  cancelItem: (input: {
    orderId: string
    itemId: string
    cancelReason: string
  }) => Promise<unknown>
  isCancellingItem: boolean
}

export const TableTabDetailContent = ({
  order,
  isPending,
  isError,
  cancelItem,
  isCancellingItem,
}: TableTabDetailContentProps) => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [cancelReason, setCancelReason] = useState('')
  const [isConfirmingCancellation, setConfirmingCancellation] = useState(false)
  const canCancelItems = [
    'PENDING',
    'ACCEPTED',
    'PREPARING',
    'READY_FOR_PICKUP',
  ].includes(order?.status ?? '')
  const activeItems =
    order?.items.filter((item) => item.status !== 'CANCELLED') ?? []
  const selectedItemNames =
    order?.items
      .filter((item) => selectedItemIds.includes(item.id))
      .map((item) => item.product.name)
      .join(', ') ?? ''
  const selectedItemsCancellationDescription = cancellationDescription(
    selectedItemIds.length,
    selectedItemNames
  )

  const toggleItem = (itemId: string, checked: boolean | 'indeterminate') => {
    setSelectedItemIds((current) =>
      checked === true
        ? [...new Set([...current, itemId])]
        : current.filter((id) => id !== itemId)
    )
  }

  const cancelSelectedItems = async () => {
    const reason = cancelReason.trim()
    if (!order || !reason || selectedItemIds.length === 0) return
    for (const itemId of selectedItemIds) {
      await cancelItem({ orderId: order.id, itemId, cancelReason: reason })
    }
    setSelectedItemIds([])
    setCancelReason('')
    setConfirmingCancellation(false)
  }

  return (
    <Box as="main" className={styles.tableTabDetailContentPage}>
      <BackLink>Voltar para comandas</BackLink>
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
          <Box className={`${motion.settle} ${styles.hero}`}>
            <Box className={styles.heroIdentity}>
              <Text size="sm" color="muted" className={styles.eyebrow}>
                Comanda #{order.orderNumber}
              </Text>
              <Heading level={1} size="2xl">
                {order.tableNumber ||
                  order.guestName ||
                  'Comanda sem identificação'}
              </Heading>
              <Box direction="row" align="center" gap={2} wrap>
                <Badge
                  variant={
                    order.paymentStatus === 'PAID' ? 'success' : 'warning'
                  }
                >
                  {order.paymentStatus === 'PAID'
                    ? 'Pago'
                    : 'Pagamento pendente'}
                </Badge>
                <Text size="sm" color="muted">
                  {order.items.length}{' '}
                  {order.items.length === 1 ? 'item' : 'itens'} na conta
                </Text>
              </Box>
            </Box>
            <Box className={styles.tableTabDetailContentTotal}>
              <Text size="sm" color="muted">
                Total da conta
              </Text>
              <Text weight="bold" size="2xl">
                {brl(Number(order.totalAmount))}
              </Text>
            </Box>
          </Box>

          <Box className={styles.tableTabDetailContent}>
            <Card
              variant="flat"
              padding="lg"
              className={`${motion.unroll} ${styles.receipt}`}
            >
              <Box className={styles.sectionHead}>
                <Heading level={2} size="lg">
                  Consumo
                </Heading>
                <Text size="sm" color="muted">
                  Confira os itens antes de fechar a conta.
                </Text>
              </Box>
              <Box as="ul" className={styles.items}>
                {order.items.map((item) => (
                  <ListRow
                    key={item.id}
                    divider="bottom"
                    padding={3}
                    className={
                      item.status === 'CANCELLED'
                        ? styles.cancelledItem
                        : selectedItemIds.includes(item.id)
                          ? styles.selectedItem
                          : undefined
                    }
                  >
                    <Box direction="row" justify="between" grow>
                      <Box direction="row" align="center" gap={3}>
                        {canCancelItems && item.status !== 'CANCELLED' && (
                          <Checkbox
                            aria-label={`Selecionar ${item.product.name} para cancelar`}
                            checked={selectedItemIds.includes(item.id)}
                            onCheckedChange={(checked) =>
                              toggleItem(item.id, checked)
                            }
                          />
                        )}
                        <Box>
                          <Text weight="bold">{item.product.name}</Text>
                          <Text size="sm" color="muted">
                            {item.quantity} × {brl(Number(item.unitPrice))}
                          </Text>
                          {item.status === 'CANCELLED' && (
                            <Text size="sm" color="danger">
                              Cancelado
                              {item.cancelReason
                                ? ` · ${item.cancelReason}`
                                : ''}
                            </Text>
                          )}
                        </Box>
                      </Box>
                      <Text
                        weight="bold"
                        color={
                          item.status === 'CANCELLED' ? 'muted' : undefined
                        }
                      >
                        {brl(Number(item.unitPrice) * item.quantity)}
                      </Text>
                    </Box>
                  </ListRow>
                ))}
              </Box>
              {canCancelItems && activeItems.length > 0 && (
                <Box className={styles.itemActions}>
                  <Text size="sm" color="muted">
                    Marque “Cancelar item” em um ou mais itens para retirá-los
                    da comanda.
                  </Text>
                  {selectedItemIds.length > 0 && (
                    <Box className={`${motion.unroll} ${styles.cancelPanel}`}>
                      <Label htmlFor="table-tab-item-cancel-reason">
                        Motivo para cancelar os itens selecionados
                      </Label>
                      <Textarea
                        id="table-tab-item-cancel-reason"
                        rows={2}
                        value={cancelReason}
                        maxLength={280}
                        placeholder="Ex.: cliente desistiu do item"
                        onChange={(event) =>
                          setCancelReason(event.target.value)
                        }
                      />
                      <Box
                        direction="row"
                        justify="between"
                        align="center"
                        gap={3}
                        wrap
                      >
                        <Text size="sm" color="muted">
                          {selectedItemIds.length}{' '}
                          {selectedItemIds.length === 1
                            ? 'item selecionado para cancelamento'
                            : 'itens selecionados para cancelamento'}
                        </Text>
                        <Button
                          size="sm"
                          loading={isCancellingItem}
                          disabled={!cancelReason.trim()}
                          onClick={() => setConfirmingCancellation(true)}
                        >
                          Cancelar itens selecionados
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
              <Box
                direction="row"
                justify="between"
                align="center"
                className={styles.receiptTotal}
              >
                <Text color="muted">Total</Text>
                <Text weight="bold" size="lg">
                  {brl(Number(order.totalAmount))}
                </Text>
              </Box>
            </Card>

            <Card
              variant="flat"
              padding="lg"
              className={`${motion.settle} ${styles.payment}`}
            >
              <Box className={styles.sectionHead}>
                <Heading level={2} size="lg">
                  Pagamento
                </Heading>
                <Text size="sm" color="muted">
                  Registre o recebimento quando o cliente pedir a conta.
                </Text>
              </Box>
              <Box className={styles.paymentMethod}>
                <Text size="sm" color="muted">
                  Forma prevista
                </Text>
                <Text weight="bold">
                  {PAYMENT_METHOD_LABEL[order.paymentMethod]}
                </Text>
              </Box>
              <Button disabled className={styles.closeButton}>
                {order.paymentStatus === 'PAID'
                  ? 'Conta encerrada'
                  : 'Fechar conta — em breve'}
              </Button>
            </Card>
          </Box>
        </>
      )}
      <Dialog
        open={isConfirmingCancellation}
        onOpenChange={(open) => !open && setConfirmingCancellation(false)}
        title="Cancelar itens da comanda?"
        description={selectedItemsCancellationDescription}
        confirmLabel="Confirmar"
        cancelLabel="Voltar"
        onConfirm={() => void cancelSelectedItems()}
        onCancel={() => setConfirmingCancellation(false)}
        loading={isCancellingItem}
      />
    </Box>
  )
}
