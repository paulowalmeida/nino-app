import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'

import { CompanyCard } from './CompanyCard/CompanyCard'

export const SettingsCompanySection = () => {
  const { company: companyDomain } = useSettingsFacade()
  const { data: company, isPending } = companyDomain.query
  const { mutate: save, isPending: isSaving } = companyDomain.save

  return (
    <CompanyCard
      company={company}
      isPending={isPending}
      isSaving={isSaving}
      onSave={save}
    />
  )
}
