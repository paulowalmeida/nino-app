import { useQuery } from '@tanstack/react-query'

import type { Company } from '@custom_types/company'
import { CompanyService } from '@services/company.service'

export const companyKey = ['company', 'mine'] as const

export const useCompany = () =>
  useQuery<Company>({
    queryKey: companyKey,
    queryFn: CompanyService.getMyCompany,
  })
