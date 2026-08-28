import { useQuery } from '@tanstack/react-query'

import { CompanyService } from '@shared/services/company/company.service'
import type { Company } from '@shared/types/company/company'

export const companyKey = ['company', 'mine'] as const

export const useCompany = () =>
  useQuery<Company>({
    queryKey: companyKey,
    queryFn: CompanyService.getMyCompany,
  })
