import { useState } from 'react'

import { useSettingsUnitDetailFacade } from '@pages/Units/facades/useSettingsUnitDetailFacade/useSettingsUnitDetailFacade'
import { UnitCard } from '@pages/Units/SettingsUnitDetailSection/UnitCard/UnitCard'

export const UnitInfo = () => {
  const [deliveryState, setDeliveryState] = useState('')
  const { units, location } = useSettingsUnitDetailFacade(deliveryState)
  const { data: unit, isPending } = units.detail
  const { mutate: save, isPending: isSaving } = units.save
  const { mutate: setMain, isPending: isPromoting } = units.setMain

  return (
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
  )
}
