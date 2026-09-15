import { type LoaderFunctionArgs, redirect } from 'react-router'

import { HOME_SECTION_BY_UNIT_ROLE } from '@shared/constants/roles.constants'
import { useSessionStore } from '@shared/states/session/session.state'
import type { UnitRole } from '@shared/types/auth/unit-role'

export const roleGuard =
  (allowed: readonly UnitRole[]) =>
  async ({ params }: LoaderFunctionArgs) => {
    const user = await useSessionStore.getState().load()
    if (!user) return redirect('/entrar')

    const { memberships, setCurrentUnit } = useSessionStore.getState()
    const membership = memberships.find(
      ({ unitId }) => unitId === params.unitId
    )
    if (!membership) return redirect('/')

    if (!allowed.includes(membership.role)) {
      return redirect(
        `/${encodeURIComponent(membership.unitId)}/${HOME_SECTION_BY_UNIT_ROLE[membership.role]}`
      )
    }

    setCurrentUnit(membership.unitId)
    return null
  }
