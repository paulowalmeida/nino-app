import { useLocation, useNavigate, useOutlet } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Tabs } from '@nino/ds/components/Tabs'

import motion from '@styles/motion.module.css'
import styles from './Marketing.module.css'

export const Marketing = () => {
  const navigate = useNavigate()
  const outlet = useOutlet()
  const { pathname } = useLocation()
  const activeTab = pathname.endsWith('/promocoes') ? 'promocoes' : 'cashback'

  return (
    <Box as="main" className={styles.marketingPage}>
      <Header
        className={`${motion.deal} ${styles.marketingHeader}`}
        size="xl"
        title="Marketing"
        description="Crie incentivos para aumentar conversão e recorrência na unidade."
      />
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
