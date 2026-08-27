import { Box } from '@nino/ds/components/Box'
import { CompanyPickCard } from '@pages/StoreSelection/components/CompanyPickList/CompanyPickCard/CompanyPickCard'
import { useStoreSelectionFacade } from '@pages/StoreSelection/facades/useStoreSelectionFacade/useStoreSelectionFacade'

export const CompanyPickList = () => {
  const { companies, selectCompany } = useStoreSelectionFacade()

  return (
    <Box direction="column" gap={3} mt={8}>
      {companies.map(({ companyId, companyName, units }, index) => (
        <CompanyPickCard
          key={companyId}
          companyName={companyName}
          units={units}
          index={index}
          onClick={() => selectCompany(units)}
        />
      ))}
    </Box>
  )
}
