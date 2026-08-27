import {
  courierRosterEntries,
  staffRosterEntries,
} from '@pages/Employees/adapters/team-roster.adapter/team-roster.adapter'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { useCouriers } from '@shared/hooks/team/useCouriers/useCouriers'
import { useStaff } from '@shared/hooks/team/useStaff/useStaff'
import { useSessionStore } from '@shared/states/session/session.state'

export const useEmployeesData = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const { data: staff, isPending: isStaffPending, isError: isStaffError } = useStaff(tenantId)
  const {
    data: couriers,
    isPending: isCourierPending,
    isError: isCourierError,
  } = useCouriers(tenantId)
  const currentUserId = useSessionStore((state) => state.user?.id)

  return {
    tenant,
    tenantId,
    staffEntries: staffRosterEntries(staff?.data ?? [], currentUserId),
    courierEntries: courierRosterEntries(couriers?.data ?? []),
    isStaffPending,
    isCourierPending,
    isError: isStaffError || isCourierError,
  }
}
