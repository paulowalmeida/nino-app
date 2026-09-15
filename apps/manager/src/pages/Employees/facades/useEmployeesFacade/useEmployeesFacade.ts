import { useEmployeesData } from '@pages/Employees/hooks/useEmployeesData/useEmployeesData'
import { useInvite } from '@shared/hooks/team/useInvite/useInvite'
import { useRemoveMember } from '@shared/hooks/team/useRemoveMember/useRemoveMember'
import { useUpdateStaffEmail } from '@shared/hooks/team/useUpdateStaffEmail/useUpdateStaffEmail'
import { useUpdateStaffRole } from '@shared/hooks/team/useUpdateStaffRole/useUpdateStaffRole'

export const useEmployeesFacade = () => {
  const data = useEmployeesData()
  const invite = useInvite(data.unitId)
  const removeMember = useRemoveMember(data.unitId)
  const updateEmail = useUpdateStaffEmail(data.unitId)
  const updateRole = useUpdateStaffRole(data.unitId)

  return {
    ...data,
    invite: invite.mutateAsync,
    updateStaffEmail: updateEmail.mutateAsync,
    removeMember: removeMember.mutate,
    removingVariables: removeMember.variables,
    isRemoving: removeMember.isPending,
    changeRole: updateRole.mutate,
    roleVariables: updateRole.variables,
    isChangingRole: updateRole.isPending,
  }
}
