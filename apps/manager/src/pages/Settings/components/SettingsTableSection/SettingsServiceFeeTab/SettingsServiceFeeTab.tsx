import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import { toServiceFeeDraft } from '@pages/Settings/adapters/toServiceFeeDraft/toServiceFeeDraft'
import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'
import type { ServiceFeeDraft } from '@pages/Settings/types/ServiceFeeDraft.type'
import {
  serviceFeePercentError,
  serviceFeePercentValue,
} from '@pages/Settings/utils/serviceFeePercentError/serviceFeePercentError'
import type { UnitSettings } from '@shared/types/settings/unit-settings.type'

import styles from './SettingsServiceFeeTab.module.css'

export const SettingsServiceFeeTab = () => {
  const { service, serviceFee } = useSettingsFacade()
  const settings = service.query.data
  const [draft, setDraft] = useState<ServiceFeeDraft | null>(null)
  const [seed, setSeed] = useState<UnitSettings | undefined>(undefined)

  /* WHY: re-semeia o rascunho quando a API manda outro retrato; sem isso o
   * formulário fica preso no primeiro carregamento. */
  if (settings && settings !== seed) {
    setSeed(settings)
    setDraft(toServiceFeeDraft(settings))
  }

  if (service.query.isPending || !settings || !draft) {
    return <Skeleton className={styles.settingsServiceFeeTabSkeleton} />
  }

  const savedDraft = toServiceFeeDraft(settings)
  const isDirty =
    draft.serviceFeeEnabled !== savedDraft.serviceFeeEnabled ||
    draft.serviceFeePercent !== savedDraft.serviceFeePercent
  const percentProblem = draft.serviceFeeEnabled
    ? serviceFeePercentError(draft.serviceFeePercent)
    : undefined

  const saveServiceFee = () =>
    serviceFee.save.mutate({
      ...settings,
      serviceFeeEnabled: draft.serviceFeeEnabled,
      serviceFeePercent: serviceFeePercentValue(draft.serviceFeePercent),
    })

  return (
    <Box className={styles.settingsServiceFeeTab}>
      <Box direction="row" align="center" gap={3}>
        <Switch
          checked={draft.serviceFeeEnabled}
          onCheckedChange={(serviceFeeEnabled) =>
            setDraft({ ...draft, serviceFeeEnabled })
          }
          aria-label="Cobrar taxa de serviço"
        />
        <Box className={styles.settingsServiceFeeTabCopy}>
          <Text weight="semibold">Cobrar taxa de serviço</Text>
          <Text size="sm" color="muted">
            Entra na conta ao pedir a conta da comanda. O cliente pode recusar e
            o atendente tira na hora.
          </Text>
        </Box>
      </Box>
      <FormField
        label="Porcentagem sobre o consumo"
        helperText="O usual no Brasil é 10%."
        error={percentProblem}
        className={styles.settingsServiceFeeTabField}
      >
        <Input
          inputMode="decimal"
          value={draft.serviceFeePercent}
          disabled={!draft.serviceFeeEnabled}
          onChange={(event) =>
            setDraft({ ...draft, serviceFeePercent: event.target.value })
          }
        />
      </FormField>
      <Button
        loading={serviceFee.save.isPending}
        disabled={!isDirty || !!percentProblem}
        className={styles.settingsServiceFeeTabSave}
        onClick={saveServiceFee}
      >
        Salvar
      </Button>
    </Box>
  )
}
