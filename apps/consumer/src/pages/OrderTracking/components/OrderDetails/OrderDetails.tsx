import { Box } from '@nino/ds/components/Box'
import { Collapsible } from '@nino/ds/components/Collapsible'
import { Text } from '@nino/ds/components/Text'
import type { OrderChannel } from '@custom_types/order/order-channel'
import type { OrderDetails as OrderDetailsData } from '@custom_types/order/order-details'
import { useStoreAddress } from '@pages/order-tracking/hooks/useStoreAddress/useStoreAddress'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import { PAYMENT_LABEL, PAYMENT_STATUS_LABEL } from './OrderDetails.constants'
import styles from './OrderDetails.module.css'
import motion from '@styles/motion.module.css'

type OrderDetailsProps = {
  details: OrderDetailsData
  channel?: OrderChannel
}

const toNumber = (value: string): number => Number(value)

const addressLine = (
  address: NonNullable<OrderDetailsData['deliveryAddress']>
) =>
  [
    `${address.street}, ${address.number}`,
    address.complement,
    `${address.neighborhood}, ${address.city} - ${address.state}`,
  ]
    .filter(Boolean)
    .join(' · ')

/** Itens, valores, pagamento e local do pedido, recolhidos no fim da tela. */
export const OrderDetails = ({ details, channel }: OrderDetailsProps) => {
  const storeAddress = useStoreAddress()
  const isDelivery =
    channel === 'DELIVERY' || (!channel && !!details.deliveryAddress)
  const itemCount = details.items.reduce((sum, item) => sum + item.quantity, 0)
  const deliveryPaid = Math.max(
    toNumber(details.deliveryFee) - toNumber(details.deliveryDiscount),
    0
  )
  const paymentStatus = PAYMENT_STATUS_LABEL[details.paymentStatus]

  return (
    <Box className={motion.riseIn} style={riseDelay(400)}>
      <Collapsible
        className={styles.details}
        trigger={
          <Text as="span" className={styles.head}>
            <Text as="span" className={styles.title}>
              Detalhes do pedido
            </Text>
            <Text as="span" className={styles.summary}>
              {itemCount} {itemCount === 1 ? 'item' : 'itens'} ·{' '}
              {brl(details.totalAmount)}
            </Text>
          </Text>
        }
        indicator
      >
        <Box className={styles.body}>
          <Box as="ul" className={styles.items}>
            {details.items.map((item) => (
              <Box as="li" key={item.id} className={styles.item}>
                <Text as="span" className={styles.qty}>
                  {item.quantity}×
                </Text>
                <Text as="span" className={styles.itemName}>
                  {item.name}
                  {item.isGift && <Text as="span"> · Brinde</Text>}
                  {item.modifiers.length > 0 && (
                    <Text as="span" className={styles.choices}>
                      {item.modifiers
                        .map((modifier) =>
                          modifier.quantity > 1
                            ? `${modifier.quantity}× ${modifier.name}`
                            : modifier.name
                        )
                        .join(', ')}
                    </Text>
                  )}
                  {item.notes && (
                    <Text as="span" className={styles.choices}>
                      “{item.notes}”
                    </Text>
                  )}
                </Text>
                <Text as="span" className={styles.amount}>
                  {item.isGift
                    ? 'Grátis'
                    : brl(
                        (toNumber(item.unitPrice) +
                          item.modifiers.reduce(
                            (sum, modifier) =>
                              sum +
                              toNumber(modifier.unitPrice) * modifier.quantity,
                            0
                          )) *
                          item.quantity
                      )}
                </Text>
              </Box>
            ))}
          </Box>

          <Box className={styles.tally}>
            <Text as="p" className={styles.row}>
              <Text as="span">Subtotal</Text>
              <Text as="span">{brl(details.subtotal)}</Text>
            </Text>
            {isDelivery && (
              <Text as="p" className={styles.row}>
                <Text as="span">Entrega</Text>
                <Text
                  as="span"
                  className={deliveryPaid === 0 ? styles.free : undefined}
                >
                  {deliveryPaid === 0 ? 'Grátis' : brl(deliveryPaid)}
                </Text>
              </Text>
            )}
            {toNumber(details.promotionDiscount) > 0 && (
              <Text as="p" className={styles.row}>
                <Text as="span">Desconto</Text>
                <Text as="span" className={styles.free}>
                  − {brl(details.promotionDiscount)}
                </Text>
              </Text>
            )}
            {toNumber(details.loyaltyDiscount) > 0 && (
              <Text as="p" className={styles.row}>
                <Text as="span">Fidelidade</Text>
                <Text as="span" className={styles.free}>
                  − {brl(details.loyaltyDiscount)}
                </Text>
              </Text>
            )}
            <Text as="p" className={styles.total}>
              <Text as="span">Total</Text>
              <Text as="span">{brl(details.totalAmount)}</Text>
            </Text>
          </Box>

          <dl className={styles.facts}>
            <Box className={styles.fact}>
              <dt>Pagamento</dt>
              <dd>
                {PAYMENT_LABEL[details.paymentMethod]}
                {paymentStatus && ` · ${paymentStatus}`}
                {details.changeFor && ` · troco para ${brl(details.changeFor)}`}
              </dd>
            </Box>
            <Box className={styles.fact}>
              <dt>{isDelivery ? 'Entrega em' : 'Retirada em'}</dt>
              <dd>
                {isDelivery
                  ? details.deliveryAddress
                    ? addressLine(details.deliveryAddress)
                    : 'Endereço não informado'
                  : (storeAddress ?? 'Balcão da loja')}
              </dd>
            </Box>
            {details.tableNumber && (
              <Box className={styles.fact}>
                <dt>Mesa</dt>
                <dd>{details.tableNumber}</dd>
              </Box>
            )}
            {details.pickupCode && (
              <Box className={styles.fact}>
                <dt>Código de retirada</dt>
                <dd className={styles.code}>{details.pickupCode}</dd>
              </Box>
            )}
            {details.notes && (
              <Box className={styles.fact}>
                <dt>Observações</dt>
                <dd>{details.notes}</dd>
              </Box>
            )}
          </dl>
        </Box>
      </Collapsible>
    </Box>
  )
}
