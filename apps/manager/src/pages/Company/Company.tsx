import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { CompanyCard } from '@pages/Company/components/CompanyCard/CompanyCard'
import { useCompanyFacade } from '@pages/Company/facades/useCompanyFacade/useCompanyFacade'

import motion from '@styles/motion.module.css'
import styles from './Company.module.css'

export const Company = () => {
  const { query, save } = useCompanyFacade()

  return (
    <Box className={styles.companyPage}>
      <Header
        mb={4}
        className={motion.deal}
        title="Empresa"
        size="xl"
        description="CNPJ, razão social e endereço."
      />

      <CompanyCard
        company={query.data}
        isPending={query.isPending}
        isSaving={save.isPending}
        onSave={save.mutate}
      />
    </Box>
  )
}
