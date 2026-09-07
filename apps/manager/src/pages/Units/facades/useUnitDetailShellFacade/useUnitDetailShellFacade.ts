import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useUnitDetailShellFacade = () => ({
  tenant: useCurrentTenant(),
})
