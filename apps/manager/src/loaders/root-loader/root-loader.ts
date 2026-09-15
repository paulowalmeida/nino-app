import { redirect } from 'react-router'

import { HOME_SECTION_BY_UNIT_ROLE } from '@shared/constants/roles.constants'
import { useSessionStore } from '@shared/states/session/session.state'
import type { Membership } from '@shared/types/auth/membership'
import { sawOnboarding } from '@shared/utils/onboarding-seen/onboarding-seen'

const entryUnit = (memberships: Membership[]): Membership =>
  memberships.find(({ isCurrent }) => isCurrent) ?? memberships[0]

/**
 * Entry point. Conta sem loja vai para as unidades, onde toda loja nasce — a
 * primeira e a décima. Antes disso, uma única vez, passa pelas boas-vindas,
 * que são puláveis a qualquer momento.
 * Stores of a single company are units of the same business, so
 * asking which one to open is friction — enter the last used and let the shell
 * switch. Stores across companies are different restaurants: that choice is
 * worth a screen.
 */
export const RootLoader = async () => {
  const user = await useSessionStore.getState().load()
  if (!user) return redirect('/entrar')

  const { memberships } = useSessionStore.getState()
  if (memberships.length === 0) {
    return redirect(sawOnboarding() ? '/unidades' : '/boas-vindas')
  }

  const companies = new Set(memberships.map(({ companyId }) => companyId))
  if (companies.size > 1) return redirect('/lojas')

  const unit = entryUnit(memberships)
  return redirect(
    `/${encodeURIComponent(unit.unitId)}/${HOME_SECTION_BY_UNIT_ROLE[unit.role]}`
  )
}
