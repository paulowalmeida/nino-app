import type { AuthUser } from '@custom_types/auth'
import { me } from '@services/auth/auth.service'
import { useSessionStore } from '@states/useSessionStore'
import { forgetSession, rememberSession } from '@utils/session-hint'

/**
 * Single bootstrap path for the session: every authenticated entry point goes
 * through here, so user and memberships are always read from the same
 * `/auth/me` payload.
 */
export const loadSession = async (): Promise<AuthUser | null> => {
  const { user, setSession } = useSessionStore.getState()
  if (user) return user

  try {
    const { memberships, ...fetched } = await me()
    setSession(fetched, memberships)
    rememberSession()
    return fetched
  } catch {
    forgetSession()
    return null
  }
}
