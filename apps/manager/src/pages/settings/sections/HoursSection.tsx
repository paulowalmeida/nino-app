import { WeekSchedule } from '@compositions/WeekSchedule'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOpeningHours, useSaveWeek } from '@hooks/settings/useOpeningHours'

export const HoursSection = () => {
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
