import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

import { useCashCommands } from '../../hooks/useCashCommands/useCashCommands'
import { useCashSession } from '../../hooks/useCashSession/useCashSession'

export const useCashFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { session, isLoadingSession, isSessionError } = useCashSession(tenantId)
  const commands = useCashCommands(tenantId, session?.id ?? null)

  return {
    session,
    isLoadingSession,
    isSessionError,
    ...commands,
  }
}
