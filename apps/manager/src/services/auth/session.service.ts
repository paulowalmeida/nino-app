import type { AuthUser } from '@custom_types/auth'
import { me } from '@services/auth/auth.service'
import { useSessionStore } from '@states/useSessionStore'

/**
 * Populates the session on the first authenticated load. `memberships` stays
 * empty until the API exposes the caller's own — `/auth/me` returns none today.
 */
export const loadSession = async (): Promise<AuthUser | null> => {
  const { user, setSession } = useSessionStore.getState()
  if (user) return user

  try {
    const fetched = await me()
    setSession(fetched, [])
    return fetched
  } catch {
    return null
  }
}
