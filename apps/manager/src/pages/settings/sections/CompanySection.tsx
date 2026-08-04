import { CompanyCard } from '@compositions/CompanyCard/CompanyCard'
import { useCompany, useSaveCompany } from '@hooks/company/useCompany'

export const CompanySection = () => {
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
