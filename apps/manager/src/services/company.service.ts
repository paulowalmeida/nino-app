import type { Company } from '@custom_types/company/company'
import type { UpdateCompanyRequest } from '@custom_types/company/update-company-request'
import { api } from '@services/http.service'

export const CompanyService = {
  getMyCompany: (): Promise<Company> => api.get<Company>('my/company'),

  updateMyCompany: (data: UpdateCompanyRequest): Promise<Company> =>
    api.patch<UpdateCompanyRequest, Company>('my/company', data),
}
