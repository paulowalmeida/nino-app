import { WeekSchedule } from '@organisms/WeekSchedule/WeekSchedule'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { useSaveWeek } from '@hooks/settings/useSaveWeek'

export const SettingsHoursSection = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { hours, isPending } = useOpeningHours(tenantId)
  const { mutateAsync: save, isPending: isSaving } = useSaveWeek(tenantId)

  return (
    <WeekSchedule
      hours={hours}
      isPending={isPending}
      isSaving={isSaving}
      onSave={save}
    />
  )
}
