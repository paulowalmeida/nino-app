import { useMutation, useQueryClient } from '@tanstack/react-query'

import { hoursKey } from '@shared/hooks/settings/useOpeningHours/useOpeningHours'
import { OpeningHoursService } from '@shared/services/opening-hours/opening-hours.service'
import type { HoursDraft } from '@shared/types/settings/hours-draft'

/**
 * One entry per weekday: creates it the first time the day is filled in,
 * updates it from then on. The API keys `(unitId, dayOfWeek)` as unique.
 */
const persistDay = (
  unitId: string,
  { id, dayOfWeek, openTime, closeTime, isOpen }: HoursDraft
) =>
  id
    ? OpeningHoursService.updateOpeningHours(unitId, id, {
        openTime,
        closeTime,
        isOpen,
      })
    : OpeningHoursService.createOpeningHours(unitId, {
        dayOfWeek,
        openTime,
        closeTime,
        isOpen,
      })

/**
 * The week is saved as one action — the store decides its schedule as a
 * whole, not day by day. Days are written in parallel; a single failure
 * fails the batch and keeps the form dirty.
 */
export const useSaveWeek = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Horários salvos',
      errorTitle: 'Os horários não foram salvos',
    },
    mutationFn: (week: HoursDraft[]) =>
      Promise.all(week.map((day) => persistDay(unitId as string, day))),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hoursKey(unitId ?? '') })
    },
  })
}
