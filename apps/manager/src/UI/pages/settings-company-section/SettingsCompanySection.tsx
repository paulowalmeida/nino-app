import { CompanyCard } from '@organisms/CompanyCard/CompanyCard'
import { useCompany } from '@hooks/company/useCompany'
import { useSaveCompany } from '@hooks/company/useSaveCompany'

export const SettingsCompanySection = () => {
  const { data: company, isPending } = useCompany()
  const { mutate: save, isPending: isSaving } = useSaveCompany()

  return (
    <CompanyCard
      company={company}
      isPending={isPending}
      isSaving={isSaving}
      onSave={save}
    />
  )
}
