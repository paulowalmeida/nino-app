import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { CompanyCard } from '@pages/Company/components/CompanyCard/CompanyCard'
import { useCompanyFacade } from '@pages/Company/facades/useCompanyFacade/useCompanyFacade'

import motion from '@styles/motion.module.css'
import styles from './Company.module.css'

export const Company = () => {
  const { query, save } = useCompanyFacade()

  return (
    <Box className={styles.companyPage}>
      <Box
        as="header"
        direction="column"
        gap={1}
        shrink={false}
        mb={4}
        className={motion.deal}
      >
        <Heading level={1} size="xl">
          Empresa
        </Heading>
        <Text size="sm" color="subtle">
          CNPJ, razão social e endereço.
        </Text>
      </Box>

      <CompanyCard
        company={query.data}
        isPending={query.isPending}
        isSaving={save.isPending}
        onSave={save.mutate}
      />
    </Box>
  )
}
