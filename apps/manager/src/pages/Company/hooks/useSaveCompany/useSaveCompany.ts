import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CompanyService } from '@shared/services/company/company.service'
import type { UpdateCompanyRequest } from '@shared/types/company/update-company-request'

import { companyKey } from '../useCompany/useCompany'

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
