import { useLogout } from '@shared/hooks/useLogout/useLogout'

export const useAccountNavigationFacade = () => {
  const logout = useLogout()

  return {
    logout: logout.mutate,
    isLoggingOut: logout.isPending,
  }
}
