import { useLocation, useNavigate, useOutlet } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Tabs } from '@nino/ds/components/Tabs'
import { Text } from '@nino/ds/components/Text'

import styles from './Marketing.module.css'

export const Marketing = () => {
  const navigate = useNavigate()
  const outlet = useOutlet()
  const { pathname } = useLocation()
  const activeTab = pathname.endsWith('/promocoes') ? 'promocoes' : 'cashback'

  return (
    <Box as="main" className={styles.marketingPage}>
      <Box as="header" className={styles.marketingHeader}>
        <Heading level={1} size="2xl">
          Marketing
        </Heading>
        <Text color="subtle" size="sm">
          Crie incentivos para aumentar conversão e recorrência na unidade.
        </Text>
      </Box>
      <Tabs
        value={activeTab}
        onValueChange={(value) => navigate(value)}
        tabs={[
          {
            value: 'cashback',
            label: 'Cashback',
            content: activeTab === 'cashback' ? outlet : null,
          },
          {
            value: 'promocoes',
            label: 'Promoções',
            content: activeTab === 'promocoes' ? outlet : null,
          },
        ]}
      />
    </Box>
  )
}
