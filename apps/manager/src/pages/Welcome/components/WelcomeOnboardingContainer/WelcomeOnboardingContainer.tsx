import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import { welcomePanelDemo } from '@pages/Welcome/adapters/welcomePanelDemo.adapter/welcomePanelDemo.adapter'
import { ScreenPreviewFrame } from '@pages/Welcome/components/WelcomeOnboardingContainer/ScreenPreviewFrame/ScreenPreviewFrame'
import { WelcomeStepTrack } from '@pages/Welcome/components/WelcomeOnboardingContainer/WelcomeStepTrack/WelcomeStepTrack'
import { WizardFooter } from '@pages/Welcome/components/WelcomeOnboardingContainer/WizardFooter/WizardFooter'
import { WELCOME_PANELS } from '@pages/Welcome/constants/welcome.constants'
import { useWelcomeFacade } from '@pages/Welcome/facades/useWelcomeFacade/useWelcomeFacade'

import styles from './WelcomeOnboardingContainer.module.css'

export const WelcomeOnboardingContainer = () => {
  const { firstName, leave } = useWelcomeFacade()
  const [index, setIndex] = useState(0)
  const isLast = index === WELCOME_PANELS.length - 1
  const panel = WELCOME_PANELS[index]

  const advance = () => (isLast ? leave() : setIndex((current) => current + 1))
  const back = () => setIndex((current) => current - 1)

  return (
    <>
      <Box className={styles.welcomeOnboardingContainerBody}>
        <Box className={styles.copy}>
          <Box key={index} className={styles.reveal}>
            <Text className={styles.stage}>
              {index === 0 && firstName
                ? `Bem-vindo, ${firstName}`
                : panel.stage}
            </Text>
            <Header
              level={1}
              size="2xl"
              title={panel.title}
              description={panel.text}
            />
          </Box>

          <WelcomeStepTrack panels={WELCOME_PANELS} index={index} />
        </Box>

        <Box key={index} className={styles.reveal}>
          <ScreenPreviewFrame screen={panel.screen}>
            {welcomePanelDemo(panel.demoKey)}
          </ScreenPreviewFrame>
        </Box>
      </Box>

      <WizardFooter
        stepCount={WELCOME_PANELS.length}
        currentStep={index}
        showBack={index > 0}
        onBack={back}
        onAdvance={advance}
        advanceLabel={isLast ? 'Ir para minha loja' : 'Continuar'}
      />
    </>
  )
}
