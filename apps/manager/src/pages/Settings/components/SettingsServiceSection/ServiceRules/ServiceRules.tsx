import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Label } from '@nino/ds/components/Label'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import {
  EMPTY_SERVICE_RULES_DRAFT,
  SERVICE_RULES_CHANNELS,
  SERVICE_RULES_METHODS,
} from '@pages/Settings/constants/settings.constants'
import {
  PAYMENT_METHOD_ICON,
  PAYMENT_METHOD_LABEL,
} from '@shared/constants/order.constants'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { ServiceRulesDraft } from '@shared/types/settings/service-rules-draft'
import type { TenantSettings } from '@shared/types/settings/tenant-settings'
import type { UpdateTenantSettingsRequest } from '@shared/types/settings/update-tenant-settings-request'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import local from './ServiceRules.module.css'

export type ServiceRulesProps = {
  settings: TenantSettings | undefined
  isPending: boolean
  isSaving: boolean
  onSave: (data: UpdateTenantSettingsRequest) => void
}

const toDraft = (settings: TenantSettings): ServiceRulesDraft => ({
  isDeliveryEnabled: settings.isDeliveryEnabled,
  isPickupEnabled: settings.isPickupEnabled,
  isCounterEnabled: settings.isCounterEnabled,
  allowGuestOrder: settings.allowGuestOrder,
  requireCpf: settings.requireCpf,
  minOrderAmount: Number(settings.minOrderAmount).toFixed(2).replace('.', ','),
  preparationMinutes: String(settings.preparationMinutes),
  deliveryMinutes: String(settings.deliveryMinutes),
  acceptedPaymentMethods: settings.acceptedPaymentMethods,
})

export const ServiceRules = ({
  settings,
  isPending,
  isSaving,
  onSave,
}: ServiceRulesProps) => {
  const [draft, setDraft] = useState<ServiceRulesDraft>(
    EMPTY_SERVICE_RULES_DRAFT
  )
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<TenantSettings | undefined>(undefined)

  /** Re-seeds the draft when the API sends a different snapshot. */
  if (settings && settings !== seed) {
    setSeed(settings)
    setDraft(toDraft(settings))
    setDirty(false)
  }

  const change = (patch: Partial<ServiceRulesDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const toggleMethod = (method: PaymentMethod) =>
    change({
      acceptedPaymentMethods: draft.acceptedPaymentMethods.includes(method)
        ? draft.acceptedPaymentMethods.filter((item) => item !== method)
        : [...draft.acceptedPaymentMethods, method],
    })

  const handleSave = () => {
    onSave({
      isDeliveryEnabled: draft.isDeliveryEnabled,
      isPickupEnabled: draft.isPickupEnabled,
      isCounterEnabled: draft.isCounterEnabled,
      allowGuestOrder: draft.allowGuestOrder,
      requireCpf: draft.requireCpf,
      minOrderAmount: Number(draft.minOrderAmount.replace(',', '.')) || 0,
      preparationMinutes: Number(draft.preparationMinutes) || 1,
      deliveryMinutes: Number(draft.deliveryMinutes) || 0,
      acceptedPaymentMethods: draft.acceptedPaymentMethods,
    })
    setDirty(false)
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <Box as="section" className={local.panel}>
      <Box as="header" className={`${motion.unroll} ${local.head}`}>
        <Heading level={2} size="xl">
          Como a loja atende
        </Heading>
        <Text size="sm" color="subtle" mt={1}>
          Vale para o app do cliente e para o pedido aberto no painel.
        </Text>
      </Box>

      <Box className={local.group}>
        {SERVICE_RULES_CHANNELS.map(({ key, label, hint }, index) => (
          <Box
            key={key}
            className={`${motion.deal} ${local.channelRow}`}
            style={riseDelay(index * 50 + 60)}
          >
            <Switch
              checked={draft[key]}
              onCheckedChange={(checked) => change({ [key]: checked })}
              aria-label={label}
            />
            <Text className={`${local.rowLabel} ${local.channelTextCell}`}>
              {label}
            </Text>
            <Text className={`${local.rowHint} ${local.channelTextCell}`}>
              {hint}
            </Text>
          </Box>
        ))}
      </Box>

      <Box className={local.group}>
        <Text className={local.groupTitle}>Formas de pagamento aceitas</Text>
        <Box direction="row" wrap className={local.chips}>
          {SERVICE_RULES_METHODS.map((method) => (
            <Button
              key={method}
              type="button"
              variant="ghost"
              aria-pressed={draft.acceptedPaymentMethods.includes(method)}
              onClick={() => toggleMethod(method)}
              className={`${motion.press} ${local.chip} ${
                draft.acceptedPaymentMethods.includes(method)
                  ? local.chipOn
                  : ''
              }`}
            >
              <Icon name={PAYMENT_METHOD_ICON[method]} />
              {PAYMENT_METHOD_LABEL[method]}
            </Button>
          ))}
        </Box>
      </Box>

      <Box className={local.group}>
        <Box className={local.channelRow}>
          <Switch
            checked={draft.allowGuestOrder}
            onCheckedChange={(checked) => change({ allowGuestOrder: checked })}
            aria-label="Pedido sem cadastro"
          />
          <Text className={`${local.rowLabel} ${local.channelTextCell}`}>
            Pedido sem cadastro
          </Text>
          <Text className={`${local.rowHint} ${local.channelTextCell}`}>
            O cliente pede informando só nome, telefone e endereço.
          </Text>
        </Box>

        <Box className={local.channelRow}>
          <Switch
            checked={draft.requireCpf}
            onCheckedChange={(checked) => change({ requireCpf: checked })}
            aria-label="Pedir CPF na nota"
          />
          <Text className={`${local.rowLabel} ${local.channelTextCell}`}>
            Pedir CPF na nota
          </Text>
          <Text className={`${local.rowHint} ${local.channelTextCell}`}>
            Some do checkout quando desligado.
          </Text>
        </Box>
      </Box>

      <Box className={local.minimum}>
        <Label className={local.rowLabel} htmlFor="min-order">
          Pedido mínimo
        </Label>
        <Input
          id="min-order"
          inputMode="decimal"
          className={local.minimumInput}
          value={draft.minOrderAmount}
          onChange={(event) => change({ minOrderAmount: event.target.value })}
        />
        <Text className={local.rowHint}>
          Deixe em 0 para não exigir mínimo.
        </Text>
      </Box>

      <Box className={local.minimum}>
        <Label className={local.rowLabel} htmlFor="preparation-minutes">
          Tempo de preparo (min)
        </Label>
        <Input
          id="preparation-minutes"
          inputMode="numeric"
          className={local.minimumInput}
          value={draft.preparationMinutes}
          onChange={(event) =>
            change({ preparationMinutes: event.target.value })
          }
        />
        <Text className={local.rowHint}>
          Tempo usado pela cozinha para preparar o pedido.
        </Text>
      </Box>

      <Box className={local.minimum}>
        <Label className={local.rowLabel} htmlFor="delivery-minutes">
          Tempo de entrega (min)
        </Label>
        <Input
          id="delivery-minutes"
          inputMode="numeric"
          className={local.minimumInput}
          value={draft.deliveryMinutes}
          onChange={(event) => change({ deliveryMinutes: event.target.value })}
        />
        <Text className={local.rowHint}>
          Tempo adicional para o pedido chegar ao cliente.
        </Text>
      </Box>

      <Button
        loading={isSaving}
        disabled={!isDirty}
        className={`${motion.press} ${local.save}`}
        onClick={handleSave}
      >
        Salvar atendimento
      </Button>
    </Box>
  )
}
