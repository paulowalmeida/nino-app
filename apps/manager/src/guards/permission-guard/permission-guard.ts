import { type LoaderFunctionArgs, redirect } from 'react-router'

import { useSessionStore } from '@shared/states/session/session.state'
import type { UnitPermission } from '@shared/types/auth/unit-permission.type'
import { homeSectionFor } from '@shared/utils/home-section/home-section'

export const permissionGuard =
  (required: UnitPermission) =>
  async ({ params }: LoaderFunctionArgs) => {
    const user = await useSessionStore.getState().load()
    if (!user) return redirect('/entrar')

    const { memberships, setCurrentUnit } = useSessionStore.getState()
    const membership = memberships.find(
      ({ unitId }) => unitId === params.unitId
    )
    if (!membership) return redirect('/')

    if (!membership.permissions.includes(required)) {
      return redirect(
        `/${encodeURIComponent(membership.unitId)}/${homeSectionFor(membership)}`
      )
    }

    setCurrentUnit(membership.unitId)
    return null
  }
