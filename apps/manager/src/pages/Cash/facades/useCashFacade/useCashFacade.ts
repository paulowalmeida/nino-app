import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useCashCommands } from '../../hooks/useCashCommands/useCashCommands'
import { useCashDate } from '../../hooks/useCashDate/useCashDate'
import { useCashSession } from '../../hooks/useCashSession/useCashSession'

export const useCashFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const { date, dateKey, isToday, setDate } = useCashDate()
  const { session, isLoadingSession, isSessionError, currentSession } =
    useCashSession(unitId, isToday, dateKey)
  const commands = useCashCommands(unitId, currentSession?.id ?? null)

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
