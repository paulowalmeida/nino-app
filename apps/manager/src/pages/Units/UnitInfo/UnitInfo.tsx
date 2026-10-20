import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import { UnitCard } from '@pages/Units/SettingsUnitDetailSection/UnitCard/UnitCard'

export const UnitInfo = () => {
  const { units } = useUnitsFacade()
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
      onSetMain={() => unit && setMain(unit.id)}
      onSave={save}
    />
  )
}
