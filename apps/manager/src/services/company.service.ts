import type { Company, UpdateCompanyRequest } from '@custom_types/company'
import { api } from '@services/http.service'

export const CompanyService = {
  getMyCompany: (): Promise<Company> => api.get<Company>('my/company'),

  updateMyCompany: (data: UpdateCompanyRequest): Promise<Company> =>
    api.patch<UpdateCompanyRequest, Company>('my', 'company', data),
}
