import { redirect } from 'react-router'

import { HOME_OF } from '@constants/roles'
import type { Membership } from '@custom_types/auth'
import { loadSession } from '@services/auth/session.service'
import { useSessionStore } from '@states/useSessionStore'

const entryUnit = (memberships: Membership[]): Membership =>
  memberships.find(({ isCurrent }) => isCurrent) ?? memberships[0]

/**
 * Entry point. Stores of a single company are units of the same business, so
 * asking which one to open is friction — enter the last used and let the shell
 * switch. Stores across companies are different restaurants: that choice is
 * worth a screen.
 */
export const RootLoader = async () => {
  const user = await loadSession()
  if (!user) return redirect('/entrar')

  const { memberships } = useSessionStore.getState()
  if (memberships.length === 0) return redirect('/criar-loja')

  const companies = new Set(memberships.map(({ companyId }) => companyId))
  if (companies.size > 1) return redirect('/lojas')

  const unit = entryUnit(memberships)
  return redirect(`/${unit.tenantId}/${HOME_OF[unit.role]}`)
}
