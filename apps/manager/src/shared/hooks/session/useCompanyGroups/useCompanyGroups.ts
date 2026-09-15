import { useSessionStore } from '@shared/states/session/session.state'
import type { Membership } from '@shared/types/auth/membership'
import type { CompanyGroup } from '@shared/types/session/company-group'

/**
 * Company is the brand (one CNPJ), Unit is the unit. Switching unit is a
 * shell gesture; switching company means changing restaurant, so the two
 * levels never share a flat list.
 */
const groupByCompany = (memberships: Membership[]): CompanyGroup[] => {
  const groups: CompanyGroup[] = []

  for (const membership of memberships) {
    const existing = groups.find(
      ({ companyId }) => companyId === membership.companyId
    )
    if (existing) existing.units.push(membership)
    else
      groups.push({
        companyId: membership.companyId,
        companyName: membership.companyName,
        units: [membership],
      })
  }

  return groups
}

export const useCompanyGroups = (): CompanyGroup[] =>
  groupByCompany(useSessionStore(({ memberships }) => memberships))
