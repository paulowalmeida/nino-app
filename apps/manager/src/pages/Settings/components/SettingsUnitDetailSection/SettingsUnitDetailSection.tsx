import { Box } from '@nino/ds/components/Box'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import {
  useSettingsFacade,
} from '../../facades/useSettingsFacade/useSettingsFacade'
import { UnitCard } from './UnitCard/UnitCard'

import local from './SettingsUnitDetailSection.module.css'

export const SettingsUnitDetailSection = () => {
  const { tenant, units } = useSettingsFacade()
  const tenantName = tenant?.tenantName ?? 'Unidade'
  const { data: unit, isPending } = units.detail
  const { mutate: save, isPending: isSaving } = units.save
  const { mutate: setMain, isPending: isPromoting } = units.setMain

  return (
    <Box className={local.panel}>
      <Breadcrumb
        trail={[{ label: 'Unidades', to: '..' }, { label: tenantName }]}
      />

      <UnitCard
        unit={unit}
        isPending={isPending}
        isSaving={isSaving}
        isMain={unit?.isMain ?? false}
        isPromoting={isPromoting}
        onSetMain={() => unit && setMain(unit.id)}
        onSave={save}
      />
    </Box>
  )
}
