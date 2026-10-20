import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import type {
  AddressPrediction,
  AddressSearchResult,
} from '@nino/lib/types/address/address-lookup'
import { COUNTER_CHANNEL_HINT } from '@pages/Counter/constants/counter.constants'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { Recipient } from '@shared/types/order/recipient'
import type { UnitMapLocation } from '@shared/types/store/unit-map-location'

import { ChoiceCard } from '../ChoiceCard/ChoiceCard'
import { DeliveryRecipientFields } from '../DeliveryRecipientFields/DeliveryRecipientFields'

import styles from './DestinationStep.module.css'

type DestinationStepProps = {
  channel: OrderChannel | null
  consumerName: string
  recipient: Recipient
  addressSuggestions: AddressPrediction[]
  isSearchingAddress: boolean
  onChannel: (channel: OrderChannel) => void
  onConsumerName: (name: string) => void
  onRecipient: (patch: Partial<Recipient>) => void
  resolveSelectedAddress: (placeId: string) => Promise<AddressSearchResult>
  resolveAddressAtPoint: (
    location: UnitMapLocation
  ) => Promise<AddressSearchResult>
  isResolvingSelectedAddress: boolean
  addressLookupRequested?: boolean
  onAddressLookupRequested?: (requested: boolean) => void
}

const destinations = [
  {
    value: 'PICKUP' as const,
    icon: 'shopping-bag' as const,
    label: 'Retirada',
  },
  {
    value: 'COUNTER' as const,
    icon: 'store' as const,
    label: 'No local',
  },
  {
    value: 'DELIVERY' as const,
    icon: 'map-pin' as const,
    label: 'Entrega',
  },
]

export const DestinationStep = ({
  channel,
  consumerName,
  recipient,
  addressSuggestions,
  isSearchingAddress,
  onChannel,
  onConsumerName,
  onRecipient,
  resolveSelectedAddress,
  resolveAddressAtPoint,
  isResolvingSelectedAddress,
  addressLookupRequested,
  onAddressLookupRequested,
}: DestinationStepProps) => (
  <Box direction="column" gap={3} className={styles.step}>
    <Box className={styles.choices}>
      {destinations.map((destination) => (
        <ChoiceCard
          key={destination.value}
          icon={<Icon name={destination.icon} />}
          label={destination.label}
          hint={COUNTER_CHANNEL_HINT[destination.value]}
          isSelected={channel === destination.value}
          onSelect={() => onChannel(destination.value)}
        />
      ))}
    </Box>

    {!channel && (
      <Text size="xs" color="muted" className={styles.destinationStepNote}>
        Escolha como o pedido sai para saber o que precisa perguntar ao cliente.
      </Text>
    )}

    {channel === 'PICKUP' ? (
      <Box direction="column" className={styles.destinationStepFields}>
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
        <Text size="xs" color="muted" className={styles.destinationStepNote}>
          Nome e telefone válidos são obrigatórios para identificar quem vai
          retirar o pedido.
        </Text>
      </Box>
    ) : channel === 'DELIVERY' ? (
      <DeliveryRecipientFields
        value={recipient}
        addressSuggestions={addressSuggestions}
        isSearchingAddress={isSearchingAddress}
        onChange={onRecipient}
        resolveSelectedAddress={resolveSelectedAddress}
        resolveAddressAtPoint={resolveAddressAtPoint}
        isResolvingSelectedAddress={isResolvingSelectedAddress}
        addressLookupRequested={addressLookupRequested}
        onAddressLookupRequested={onAddressLookupRequested}
      />
    ) : channel ? (
      <Box direction="column" className={styles.destinationStepFields}>
        <FormField label="Nome de quem pediu">
          <Input
            placeholder="Ex.: Ana"
            aria-label="Nome de quem pediu"
            value={consumerName}
            onChange={(event) => onConsumerName(event.target.value)}
          />
        </FormField>
        <Text size="xs" color="muted" className={styles.destinationStepNote}>
          Preencha o nome para identificar o pedido.
        </Text>
      </Box>
    ) : null}
  </Box>
)
