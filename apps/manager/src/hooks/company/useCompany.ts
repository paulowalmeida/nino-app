import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Company, UpdateCompanyRequest } from '@custom_types/company'
import { getMyCompany, updateMyCompany } from '@services/company/company.service'

const companyKey = ['company', 'mine'] as const

export const useCompany = () =>
  useQuery<Company>({ queryKey: companyKey, queryFn: getMyCompany })

export const useSaveCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Dados da empresa salvos',
      errorTitle: 'Os dados da empresa não foram salvos',
    },
    mutationFn: (data: UpdateCompanyRequest) => updateMyCompany(data),
    onSuccess: (company) => queryClient.setQueryData(companyKey, company),
  })
}
