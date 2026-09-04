import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'
import { COUNTER_CHANNEL_HINT } from '@pages/Counter/constants/counter.constants'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { Recipient } from '@shared/types/order/recipient'
import type { DeliveryCity } from '@shared/types/store/delivery-city'

import { ChoiceCard } from '../ChoiceCard/ChoiceCard'
import { DeliveryRecipientFields } from '../DeliveryRecipientFields/DeliveryRecipientFields'

import styles from './DestinationStep.module.css'

type DestinationStepProps = {
  channel: OrderChannel | null
  customerName: string
  tableNumber: string
  recipient: Recipient
  storeAddress: { city: string; state: string }
  deliveryCities: DeliveryCity[]
  addressSuggestions: AddressSearchResult[]
  isSearchingAddress: boolean
  onChannel: (channel: OrderChannel) => void
  onCustomerName: (name: string) => void
  onTableNumber: (table: string) => void
  onRecipient: (patch: Partial<Recipient>) => void
}

const destinations = [
  {
    value: 'PICKUP' as const,
    icon: '🛍️',
    label: 'Retirada',
  },
  {
    value: 'COUNTER' as const,
    icon: '🍽️',
    label: 'No local',
  },
  {
    value: 'DELIVERY' as const,
    icon: '🛵',
    label: 'Entrega',
  },
]

export const DestinationStep = ({
  channel,
  customerName,
  tableNumber,
  recipient,
  storeAddress,
  deliveryCities,
  addressSuggestions,
  isSearchingAddress,
  onChannel,
  onCustomerName,
  onTableNumber,
  onRecipient,
}: DestinationStepProps) => (
  <Box direction="column" gap={3} className={styles.step}>
    <Box className={styles.choices}>
      {destinations.map((destination) => (
        <ChoiceCard
          key={destination.value}
          icon={destination.icon}
          label={destination.label}
          hint={COUNTER_CHANNEL_HINT[destination.value]}
          isSelected={channel === destination.value}
          onSelect={() => onChannel(destination.value)}
        />
      ))}
    </Box>

    {!channel && (
      <Text size="xs" color="muted" className={styles.note}>
        Escolha como o pedido sai para saber o que precisa perguntar ao cliente.
      </Text>
    )}

    {channel === 'PICKUP' ? (
      <Box className={styles.identity}>
        <FormField label="Nome de quem pediu">
          <Input
            aria-label="Nome de quem pediu"
            value={recipient.name}
            onChange={(event) => onRecipient({ name: event.target.value })}
          />
        </FormField>
        <FormField label="Telefone">
          <PhoneInput
            aria-label="Telefone"
            type="tel"
            value={recipient.phone}
            onChange={(event) => onRecipient({ phone: event.target.value })}
          />
        </FormField>
      </Box>
    ) : channel === 'DELIVERY' ? (
      <DeliveryRecipientFields
        isDelivery={channel === 'DELIVERY'}
        value={recipient}
        storeAddress={storeAddress}
        deliveryCities={deliveryCities}
        addressSuggestions={addressSuggestions}
        isSearchingAddress={isSearchingAddress}
        onChange={onRecipient}
      />
    ) : channel ? (
      <Box direction="column" className={styles.fields}>
        <Box className={styles.identity}>
          <FormField label="Nome de quem pediu (opcional)">
            <Input
              placeholder="Ex.: Ana"
              aria-label="Nome de quem pediu (opcional)"
              value={customerName}
              onChange={(event) => onCustomerName(event.target.value)}
            />
          </FormField>
          {channel === 'COUNTER' && (
            <FormField label="Mesa (opcional)">
              <Input
                placeholder="Ex.: 12"
                inputMode="numeric"
                aria-label="Mesa (opcional)"
                value={tableNumber}
                onChange={(event) => onTableNumber(event.target.value)}
              />
            </FormField>
          )}
        </Box>
        <Text size="xs" color="muted" className={styles.note}>
          Preencha o nome, a mesa ou os dois para identificar o pedido.
        </Text>
      </Box>
    ) : null}
  </Box>
)
