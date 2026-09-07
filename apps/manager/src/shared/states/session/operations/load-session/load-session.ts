import { AuthService } from '@shared/services/auth/auth.service'
import type { GetSession } from '@shared/types/session/get-session'
import { forgetSession, rememberSession } from '@shared/utils/session-hint/session-hint'

export const loadSession = async (get: GetSession) => {
  const { user, setSession } = get()
  if (user) return user

  try {
    const { memberships, ...fetched } = await AuthService.me()
    setSession(fetched, memberships)
    rememberSession()
    return fetched
  } catch {
    forgetSession()
    return null
  }
}
