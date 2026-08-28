import { useCompany } from '@pages/Company/hooks/useCompany/useCompany'
import { useSaveCompany } from '@pages/Company/hooks/useSaveCompany/useSaveCompany'

export const useCompanyFacade = () => ({
  query: useCompany(),
  save: useSaveCompany(),
})
