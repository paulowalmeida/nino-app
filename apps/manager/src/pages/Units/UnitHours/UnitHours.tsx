import { WeekSchedule } from '@pages/Units/components/WeekSchedule/WeekSchedule'
import { useUnitHoursFacade } from '@pages/Units/facades/useUnitHoursFacade/useUnitHoursFacade'

export const UnitHours = () => {
  const { query, save } = useUnitHoursFacade()

  return (
    <WeekSchedule
      hours={query.hours}
      isPending={query.isPending}
      isSaving={save.isPending}
      onSave={save.mutateAsync}
    />
  )
}
