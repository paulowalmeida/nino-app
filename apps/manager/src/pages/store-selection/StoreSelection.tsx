import { useNavigate } from 'react-router'

import { Flexbox } from '@nino/ds/components/Flexbox'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import type { Membership } from '@custom_types/auth/membership'
import { CompanyPickCard } from '@components/CompanyPickCard/CompanyPickCard'
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
    <Flexbox direction="row" className={styles.shell}>
      <Flexbox
        direction="column"
        className={`${motion.settle} ${styles.panel}`}
      >
        <Heading level={1} size="2xl" className={styles.title}>
          Seus restaurantes
        </Heading>
        <Text size="sm" color="muted" mt={2}>
          Escolha qual você quer gerenciar
        </Text>

        <Flexbox direction="column" gap={3} mt={8}>
          {companies.map(({ companyId, companyName, units }, index) => (
            <CompanyPickCard
              key={companyId}
              companyName={companyName}
              units={units}
              index={index}
              onClick={handleSelectCompany(units)}
            />
          ))}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  )
}
