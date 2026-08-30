import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

import { useCashCommands } from '../../hooks/useCashCommands/useCashCommands'
import { useCashDate } from '../../hooks/useCashDate/useCashDate'
import { useCashSession } from '../../hooks/useCashSession/useCashSession'

export const useCashFacade = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { date, dateKey, isToday, setDate } = useCashDate()
  const { session, isLoadingSession, isSessionError, currentSession } =
    useCashSession(tenantId, isToday, dateKey)
  const commands = useCashCommands(tenantId, currentSession?.id ?? null)

  return {
    session,
    isLoadingSession,
    isSessionError,
    date,
    isToday,
    setDate,
    ...commands,
  }
}
