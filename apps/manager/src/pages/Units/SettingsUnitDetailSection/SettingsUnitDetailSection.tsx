import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import { useSettingsUnitDetailFacade } from '../facades/useSettingsUnitDetailFacade/useSettingsUnitDetailFacade'
import { UnitCard } from './UnitCard/UnitCard'

import local from './SettingsUnitDetailSection.module.css'

export const SettingsUnitDetailSection = () => {
  const [deliveryState, setDeliveryState] = useState('')
  const { tenant, units, location } = useSettingsUnitDetailFacade(deliveryState)
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
        location={location}
        onDeliveryStateChange={setDeliveryState}
        onSetMain={() => unit && setMain(unit.id)}
        onSave={save}
      />
    </Box>
  )
}
