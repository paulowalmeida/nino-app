import { useSettingsFacade } from '../../facades/useSettingsFacade/useSettingsFacade'
import { WeekSchedule } from './WeekSchedule/WeekSchedule'

export const SettingsHoursSection = () => {
  const { hours: hoursDomain } = useSettingsFacade()
  const { hours, isPending } = hoursDomain.query
  const { mutateAsync: save, isPending: isSaving } = hoursDomain.save

  return (
    <WeekSchedule
      hours={hours}
      isPending={isPending}
      isSaving={isSaving}
      onSave={save}
    />
  )
}
