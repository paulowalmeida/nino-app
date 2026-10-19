import { UNIT_MANAGER_ROLES } from '@shared/constants/roles.constants'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useTabPermissions = () => {
  const role = useCurrentUnit()?.role

  return {
    canCancelTab:
      !!role && UNIT_MANAGER_ROLES.some((managerRole) => managerRole === role),
  }
}
