import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Company, UpdateCompanyRequest } from '@custom_types/company'
import { getMyCompany, updateMyCompany } from '@services/company/company.service'

const companyKey = ['company', 'mine'] as const

export const useCompany = () =>
  useQuery<Company>({ queryKey: companyKey, queryFn: getMyCompany })

export const useSaveCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCompanyRequest) => updateMyCompany(data),
    onSuccess: (company) => queryClient.setQueryData(companyKey, company),
  })
}
