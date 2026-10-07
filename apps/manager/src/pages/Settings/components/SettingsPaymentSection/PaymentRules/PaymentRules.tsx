import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Label } from '@nino/ds/components/Label'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import { toServiceRulesDraft } from '@pages/Settings/adapters/toServiceRulesDraft/toServiceRulesDraft'
import {
  EMPTY_SERVICE_RULES_DRAFT,
  SERVICE_RULES_METHODS,
} from '@pages/Settings/constants/settings.constants'
import {
  PAYMENT_METHOD_ICON,
  PAYMENT_METHOD_LABEL,
} from '@shared/constants/order.constants'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { ServiceRulesDraft } from '@shared/types/settings/service-rules-draft'
import type { UnitSettings } from '@shared/types/settings/unit-settings'
import type { UpdateUnitSettingsRequest } from '@shared/types/settings/update-unit-settings-request'

import motion from '@styles/motion.module.css'
import local from './PaymentRules.module.css'

export type PaymentRulesProps = {
  settings: UnitSettings | undefined
  isPending: boolean
  isSaving: boolean
  onSave: (data: UpdateUnitSettingsRequest) => void
}

export const PaymentRules = ({
  settings,
  isPending,
  isSaving,
  onSave,
}: PaymentRulesProps) => {
  const [draft, setDraft] = useState<ServiceRulesDraft>(
    settings ? toServiceRulesDraft(settings) : EMPTY_SERVICE_RULES_DRAFT
  )
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<UnitSettings | undefined>(undefined)

  if (settings && settings !== seed) {
    setSeed(settings)
    setDraft(toServiceRulesDraft(settings))
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
    if (!settings) return

    onSave({
      ...settings,
      requireCpf: draft.requireCpf,
      minOrderAmount: Number(draft.minOrderAmount.replace(',', '.')) || 0,
      acceptedPaymentMethods: draft.acceptedPaymentMethods,
    })
    setDirty(false)
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <Box as="section" className={local.paymentRulesPanel}>
      <Box as="header" className={`${motion.unroll} ${local.head}`}>
        <Heading level={2} size="xl">
          Pagamento
        </Heading>
        <Text size="sm" color="subtle" mt={1}>
          Defina como o cliente paga e as regras mínimas para fazer um pedido.
        </Text>
      </Box>

      <Box id="formas-de-pagamento" className={local.paymentRulesGroup}>
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

      <Box id="pedir-cpf-na-nota" className={local.paymentRulesGroup}>
        <Box className={local.channelRow}>
          <Switch
            checked={draft.requireCpf}
            onCheckedChange={(requireCpf) => change({ requireCpf })}
            aria-label="Pedir CPF na nota"
          />
          <Text className={`${local.rowLabel} ${local.textCell}`}>
            Pedir CPF na nota
          </Text>
          <Text className={`${local.rowHint} ${local.textCell}`}>
            O CPF aparece como opção no checkout do cliente.
          </Text>
        </Box>
      </Box>

      <Box id="pedido-minimo" className={local.paymentRulesField}>
        <Label htmlFor="min-order">
          <FieldHint
            label="Pedido mínimo"
            hint="Deixe em 0 para não exigir valor mínimo."
          />
        </Label>
        <Input
          id="min-order"
          inputMode="decimal"
          className={local.fieldInput}
          value={draft.minOrderAmount}
          onChange={(event) => change({ minOrderAmount: event.target.value })}
        />
      </Box>

      <Button
        loading={isSaving}
        disabled={!isDirty}
        className={`${motion.press} ${local.save}`}
        onClick={handleSave}
      >
        Salvar pagamento
      </Button>
    </Box>
  )
}
