import { useUnitsDomain } from '@pages/Units/hooks/useUnitsDomain/useUnitsDomain'
import { useUnitsStoreForm } from '@pages/Units/hooks/useUnitsStoreForm/useUnitsStoreForm'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useLogout } from '@shared/hooks/session/useLogout/useLogout'
import { useSessionStore } from '@shared/states/session/session.state'

export const useUnitsFacade = () => {
  const user = useSessionStore((state) => state.user)
  const unit = useCurrentUnit()
  const { logout } = useLogout()
  const storeForm = useUnitsStoreForm()
  const units = useUnitsDomain()

  return { user, unit, logout, ...storeForm, units }
}
