import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { CompanyPickCard } from '@pages/StoreSelection/components/CompanyPickList/CompanyPickCard/CompanyPickCard'
import { useStoreSelectionFacade } from '@pages/StoreSelection/facades/useStoreSelectionFacade/useStoreSelectionFacade'

export const CompanyPickList = () => {
  const { companies, selectCompany } = useStoreSelectionFacade()

  if (companies.length === 0) {
    return (
      <EmptyState size="md" illustration={<NinoMascot />} title="Nada por aqui">
        Sua conta ainda não está vinculada a nenhuma loja. Fale com quem
        administra a sua unidade para receber um convite.
      </EmptyState>
    )
  }

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
