import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Label } from '@nino/ds/components/Label'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import { toCashbackDraft } from '@pages/Units/adapters/toCashbackDraft/toCashbackDraft'
import { EMPTY_CASHBACK_DRAFT } from '@pages/Units/constants/unit.constants'
import type { CashbackDraft } from '@shared/types/settings/cashback-draft'
import type { UnitSettings } from '@shared/types/settings/unit-settings'
import type { UpdateUnitSettingsRequest } from '@shared/types/settings/update-unit-settings-request'
import { maskMoney, moneyValue } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import local from './CashbackRules.module.css'

export type CashbackRulesProps = {
  settings: UnitSettings | undefined
  isPending: boolean
  isSaving: boolean
  onSave: (data: UpdateUnitSettingsRequest) => void
}

export const CashbackRules = ({
  settings,
  isPending,
  isSaving,
  onSave,
}: CashbackRulesProps) => {
  const [draft, setDraft] = useState<CashbackDraft>(EMPTY_CASHBACK_DRAFT)
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<UnitSettings | undefined>(undefined)

  // WHY: re-semeia o rascunho quando a API manda outro retrato; sem isso o
  // formulário fica preso no primeiro carregamento.
  if (settings && settings !== seed) {
    setSeed(settings)
    setDraft(toCashbackDraft(settings))
    setDirty(false)
  }

  const change = (patch: Partial<CashbackDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const handleSave = () => {
    if (!settings) return

    onSave({
      ...settings,
      cashbackEnabled: draft.cashbackEnabled,
      cashbackPercent: Number(draft.cashbackPercent.replace(',', '.')) || 0,
      cashbackMinRedeem: moneyValue(draft.cashbackMinRedeem),
    })
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <Box as="section" className={local.panel}>
      <Box as="header" className={`${motion.unroll} ${local.head}`}>
        <Heading level={2} size="xl">
          Cashback desta unidade
        </Heading>
        <Text size="sm" color="subtle" mt={1}>
          Parte do que o cliente gasta volta como crédito para a próxima compra
          aqui. O crédito não vale nas outras unidades.
        </Text>
      </Box>

      <Box className={local.group}>
        <Box className={local.switchRow}>
          <Switch
            checked={draft.cashbackEnabled}
            onCheckedChange={(cashbackEnabled) => change({ cashbackEnabled })}
            aria-label="Oferecer cashback"
          />
          <Text className={`${local.rowLabel} ${local.textCell}`}>
            Oferecer cashback
          </Text>
          <Text className={`${local.rowHint} ${local.textCell}`}>
            Desligado, quem já tem crédito mantém o saldo guardado.
          </Text>
        </Box>
      </Box>

      <Box className={local.field}>
        <Label htmlFor="cashback-percent">
          <FieldHint
            label="Quanto volta (%)"
            hint="Percentual sobre os produtos. A taxa de entrega fica de fora."
          />
        </Label>
        <Input
          id="cashback-percent"
          inputMode="decimal"
          className={local.fieldInput}
          value={draft.cashbackPercent}
          disabled={!draft.cashbackEnabled}
          onChange={(event) => change({ cashbackPercent: event.target.value })}
        />
      </Box>

      <Box className={local.field}>
        <Label htmlFor="cashback-min-redeem">
          <FieldHint
            label="Saldo mínimo para usar (R$)"
            hint="Abaixo disso o crédito continua acumulando, sem poder ser gasto."
          />
        </Label>
        <Input
          id="cashback-min-redeem"
          inputMode="decimal"
          className={local.fieldInput}
          value={draft.cashbackMinRedeem}
          disabled={!draft.cashbackEnabled}
          onChange={(event) =>
            change({ cashbackMinRedeem: maskMoney(event.target.value) })
          }
        />
      </Box>

      <Button
        loading={isSaving}
        disabled={!isDirty}
        className={`${motion.press} ${local.save}`}
        onClick={handleSave}
      >
        Salvar
      </Button>
    </Box>
  )
}
