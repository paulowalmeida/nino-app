import { useNavigate } from 'react-router'

import { currentOrFirstUnit } from '@pages/StoreSelection/utils/current-or-first-unit'
import type { Membership } from '@shared/types/auth/membership'

export const useSelectCompany = () => {
  const navigate = useNavigate()

  return (units: Membership[]) =>
    void navigate(`/${currentOrFirstUnit(units).tenantId}/visao-geral`)
}
