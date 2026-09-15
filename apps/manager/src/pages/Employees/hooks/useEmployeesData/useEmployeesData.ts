import {
  courierRosterEntries,
  staffRosterEntries,
} from '@pages/Employees/adapters/team-roster.adapter/team-roster.adapter'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useCouriers } from '@shared/hooks/team/useCouriers/useCouriers'
import { useStaff } from '@shared/hooks/team/useStaff/useStaff'
import { useSessionStore } from '@shared/states/session/session.state'

export const useEmployeesData = () => {
  const unit = useCurrentUnit()
  const unitId = unit?.unitId ?? null
  const { data: staff, isPending: isStaffPending, isError: isStaffError } = useStaff(unitId)
  const {
    data: couriers,
    isPending: isCourierPending,
    isError: isCourierError,
  } = useCouriers(unitId)
  const currentUserId = useSessionStore((state) => state.user?.id)

  return {
    unit,
    unitId,
    staffEntries: staffRosterEntries(staff?.data ?? [], currentUserId),
    courierEntries: courierRosterEntries(couriers?.data ?? []),
    isStaffPending,
    isCourierPending,
    isError: isStaffError || isCourierError,
  }
}
