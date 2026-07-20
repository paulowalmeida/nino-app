import type { Company, UpdateCompanyRequest } from '@custom_types/company'
import { ApiFactory } from '@services/api/api.service'

const { get, patch } = ApiFactory()

export const getMyCompany = (): Promise<Company> => get<Company>('my/company')

/**
 * `PATCH /my/company` não tem id de recurso: o `patch` da factory monta
 * `<url>/<id>`, então a última parte da rota entra no lugar do id.
 */
export const updateMyCompany = (
  data: UpdateCompanyRequest
): Promise<Company> =>
  patch<UpdateCompanyRequest, Company>('my', 'company', data)
