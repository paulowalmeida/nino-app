import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useUnitDetailShellFacade = () => ({
  unit: useCurrentUnit(),
})
