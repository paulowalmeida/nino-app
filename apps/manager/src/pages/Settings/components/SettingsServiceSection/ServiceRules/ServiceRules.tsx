import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { Header } from '@nino/ds/components/Header'
import { Input } from '@nino/ds/components/Input'
import { Label } from '@nino/ds/components/Label'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import { toServiceRulesDraft } from '@pages/Settings/adapters/toServiceRulesDraft/toServiceRulesDraft'
import {
  EMPTY_SERVICE_RULES_DRAFT,
  SERVICE_RULES_CHANNELS,
} from '@pages/Settings/constants/settings.constants'
import type { ServiceRulesDraft } from '@shared/types/settings/service-rules-draft'
import type { UnitSettings } from '@shared/types/settings/unit-settings.type'
import type { UpdateUnitSettingsRequest } from '@shared/types/settings/update-unit-settings-request.type'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import local from './ServiceRules.module.css'

export type ServiceRulesProps = {
  settings: UnitSettings | undefined
  isPending: boolean
  isSaving: boolean
  onSave: (data: UpdateUnitSettingsRequest) => void
}

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
  const [seed, setSeed] = useState<UnitSettings | undefined>(undefined)

  /** Re-seeds the draft when the API sends a different snapshot. */
  if (settings && settings !== seed) {
    setSeed(settings)
    setDraft(toServiceRulesDraft(settings))
    setDirty(false)
  }

  const change = (patch: Partial<ServiceRulesDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const handleSave = () => {
    if (!settings) return

    onSave({
      ...settings,
      isDeliveryEnabled: draft.isDeliveryEnabled,
      isPickupEnabled: draft.isPickupEnabled,
      isCounterEnabled: draft.isCounterEnabled,
      showAddressOnStoreInfo: draft.showAddressOnStoreInfo,
      allowGuestOrder: draft.allowGuestOrder,
      preparationMinutes: Number(draft.preparationMinutes) || 1,
      deliveryMinutes: Number(draft.deliveryMinutes) || 0,
    })
    setDirty(false)
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <Box as="section" className={local.serviceRulesPanel}>
      <Header
        className={`${motion.deal} ${local.head}`}
        level={2}
        size="xl"
        title="Atendimento"
        description="Como a loja atende: Vale para o app do cliente e para o pedido aberto no painel."
      />

      <Box className={local.serviceRulesGroup}>
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

      <Box className={local.serviceRulesGroup}>
        <Box className={local.channelRow}>
          <Switch
            checked={draft.showAddressOnStoreInfo}
            onCheckedChange={(checked) =>
              change({ showAddressOnStoreInfo: checked })
            }
            aria-label="Exibir endereço nos detalhes da loja"
          />
          <Text className={`${local.rowLabel} ${local.channelTextCell}`}>
            Exibir endereço nos detalhes da loja
          </Text>
          <Text className={`${local.rowHint} ${local.channelTextCell}`}>
            Mostra o endereço no painel de informações do cliente.
          </Text>
        </Box>
      </Box>

      <Box className={local.serviceRulesGroup}>
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
      </Box>

      <Box className={local.minimum}>
        <Label htmlFor="preparation-minutes">
          <FieldHint
            label="Tempo de preparo (min)"
            hint="Tempo usado pela cozinha para preparar o pedido."
          />
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
      </Box>

      <Box className={local.minimum}>
        <Label htmlFor="delivery-minutes">
          <FieldHint
            label="Tempo de entrega (min)"
            hint="Tempo adicional para o pedido chegar ao cliente."
          />
        </Label>
        <Input
          id="delivery-minutes"
          inputMode="numeric"
          className={local.minimumInput}
          value={draft.deliveryMinutes}
          onChange={(event) => change({ deliveryMinutes: event.target.value })}
        />
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
