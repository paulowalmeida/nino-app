import { type LoaderFunctionArgs, redirect } from 'react-router'

import { STORE_DRAFT_KEY } from '@shared/constants/store-draft.constants'
import { useSessionStore } from '@shared/states/session/session.state'
import { clearDraft } from '@shared/utils/form-draft/form-draft'
import { hadSession } from '@shared/utils/session-hint/session-hint'

const SIGNUP_PATH = '/cadastrar'

export const GuestGuard = async ({ request }: LoaderFunctionArgs) => {
  if (!hadSession()) return null

  const user = await useSessionStore.getState().load()
  if (!user) return null

  const { memberships } = useSessionStore.getState()
  if (memberships.length > 0) return redirect('/')

  const { pathname } = new URL(request.url)
  if (pathname === SIGNUP_PATH) return redirect('/unidades')

  clearDraft(STORE_DRAFT_KEY)

  return null
}
