import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateCompanyRequest } from '@custom_types/company'
import { CompanyService } from '@services/company.service'

import { companyKey } from './useCompany'

export const useSaveCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Dados da empresa salvos',
      errorTitle: 'Os dados da empresa não foram salvos',
    },
    mutationFn: (data: UpdateCompanyRequest) =>
      CompanyService.updateMyCompany(data),
    onSuccess: (company) => queryClient.setQueryData(companyKey, company),
  })
}
