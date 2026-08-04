import type { Membership } from '@custom_types/auth'
import type { CompanyGroup } from '@custom_types/session/company-group'
import { useSessionStore } from '@states/useSessionStore'

/**
 * Company is the brand (one CNPJ), Tenant is the unit. Switching unit is a
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
