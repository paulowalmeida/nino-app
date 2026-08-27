import { useUnitsStoreForm } from '@pages/Units/hooks/useUnitsStoreForm/useUnitsStoreForm'
import { useLogout } from '@shared/hooks/session/useLogout/useLogout'
import { useSessionStore } from '@shared/states/session/session.state'

export const useUnitsFacade = () => {
  const user = useSessionStore((state) => state.user)
  const { logout } = useLogout()
  const storeForm = useUnitsStoreForm()

  return { user, logout, ...storeForm }
}
