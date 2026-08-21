import { useNavigate } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import type { Membership } from '@custom_types/auth/membership'
import { CompanyPickCard } from '@molecules/CompanyPickCard/CompanyPickCard'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { currentOrFirstUnit } from '@utils/company-unit'

import styles from './StoreSelection.module.css'
import motion from '@styles/motion.module.css'

export const StoreSelection = () => {
  const navigate = useNavigate()
  const companies = useCompanyGroups()

  const handleSelectCompany = (units: Membership[]) => () => {
    void navigate(`/${currentOrFirstUnit(units).tenantId}/visao-geral`)
  }

  return (
    <Box direction="row" className={styles.shell}>
      <Box
        direction="column"
        className={`${motion.settle} ${styles.panel}`}
      >
        <Heading level={1} size="2xl" className={styles.title}>
          Seus restaurantes
        </Heading>
        <Text size="sm" color="muted" mt={2}>
          Escolha qual você quer gerenciar
        </Text>

        <Box direction="column" gap={3} mt={8}>
          {companies.map(({ companyId, companyName, units }, index) => (
            <CompanyPickCard
              key={companyId}
              companyName={companyName}
              units={units}
              index={index}
              onClick={handleSelectCompany(units)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
