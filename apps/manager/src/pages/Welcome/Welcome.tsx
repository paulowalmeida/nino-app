import { Box } from '@nino/ds/components/Box'
import { BrandTopBar } from '@pages/Welcome/components/BrandTopBar/BrandTopBar'
import { WelcomeOnboardingContainer } from '@pages/Welcome/components/WelcomeOnboardingContainer/WelcomeOnboardingContainer'

import styles from './Welcome.module.css'

export const Welcome = () => (
  <Box direction="column" className={styles.welcomeShell}>
    <BrandTopBar />

    <Box as="main" direction="column" className={styles.welcomePage}>
      <WelcomeOnboardingContainer />
    </Box>
  </Box>
)
