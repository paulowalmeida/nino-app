import { useUnitsDomain } from '@pages/Units/hooks/useUnitsDomain/useUnitsDomain'
import { useUnitsStoreForm } from '@pages/Units/hooks/useUnitsStoreForm/useUnitsStoreForm'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { useLogout } from '@shared/hooks/session/useLogout/useLogout'
import { useSessionStore } from '@shared/states/session/session.state'

export const useUnitsFacade = () => {
  const user = useSessionStore((state) => state.user)
  const tenant = useCurrentTenant()
  const { logout } = useLogout()
  const storeForm = useUnitsStoreForm()
  const units = useUnitsDomain()

  return { user, tenant, logout, ...storeForm, units }
}
