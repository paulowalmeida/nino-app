import { api } from '@shared/services/http/http.service'
import type { Company } from '@shared/types/company/company'
import type { UpdateCompanyRequest } from '@shared/types/company/update-company-request'

export const CompanyService = {
  getMyCompany: (): Promise<Company> => api.get<Company>('my/company'),

  updateMyCompany: (data: UpdateCompanyRequest): Promise<Company> =>
    api.patch<UpdateCompanyRequest, Company>('my/company', data),
}
