import { backofficeService } from '@app/services/backoffice.service'
import { sessionHint } from '@app/services/http.service'
import { BackofficeUser, LoginInput } from '@app/services/types'
import { ApiError } from '@nino/lib/utils/api-error'
import { useCallback, useEffect, useState } from 'react'

type SessionState = {
  user: BackofficeUser | null
  isLoading: boolean
  error: string | null
}

export function useBackofficeSession() {
  const [state, setState] = useState<SessionState>({
    user: null,
    isLoading: true,
    error: null,
  })

  const loadSession = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }))
    try {
      const user = await backofficeService.getMe()
      setState({ user, isLoading: false, error: null })
    } catch (error) {
      const isExpectedVisitor = error instanceof ApiError && error.status === 401
      setState({
        user: null,
        isLoading: false,
        error: isExpectedVisitor
          ? null
          : error instanceof Error
            ? error.message
            : 'Não foi possível validar sua sessão.',
      })
    }
  }, [])

  useEffect(() => {
    void loadSession()
    const onSessionEnded = () =>
      setState({ user: null, isLoading: false, error: null })
    window.addEventListener('backoffice-session-ended', onSessionEnded)
    return () =>
      window.removeEventListener('backoffice-session-ended', onSessionEnded)
  }, [loadSession])

  const login = useCallback(async (input: LoginInput) => {
    const user = await backofficeService.login(input)
    setState({ user, isLoading: false, error: null })
  }, [])

  const logout = useCallback(async () => {
    await backofficeService.logout()
  }, [])

  return { ...state, login, logout, retry: loadSession, clearSession: sessionHint.clear }
}
