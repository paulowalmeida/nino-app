import { useSelectCompany } from '@pages/StoreSelection/hooks/useSelectCompany/useSelectCompany'
import { useCompanyGroups } from '@shared/hooks/session/useCompanyGroups/useCompanyGroups'

export const useStoreSelectionFacade = () => {
  const companies = useCompanyGroups()
  const selectCompany = useSelectCompany()

  return { companies, selectCompany }
}
