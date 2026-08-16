import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { welcomePanelDemo } from '@adapters/welcomePanelDemo.adapter'
import { ScreenPreviewFrame } from
  '@organisms/ScreenPreviewFrame/ScreenPreviewFrame'
import { WelcomeStepTrack } from
  '@organisms/WelcomeStepTrack/WelcomeStepTrack'
import { WizardFooter } from '@organisms/WizardFooter/WizardFooter'
import type { WelcomePanel } from '@constants/welcome.constants'

import styles from './WelcomeOnboardingPanel.module.css'

type WelcomeOnboardingPanelProps = {
  panels: WelcomePanel[]
  index: number
  firstName: string
  isLast: boolean
  onAdvance: () => void
  onBack: () => void
}

export const WelcomeOnboardingPanel = ({
  panels,
  index,
  firstName,
  isLast,
  onAdvance,
  onBack,
}: WelcomeOnboardingPanelProps) => {
  const panel = panels[index]

  return (
    <>
      <div className={styles.body}>
        <div className={styles.copy}>
          <div key={index} className={styles.reveal}>
            <Text className={styles.stage}>
              {index === 0 && firstName
                ? `Bem-vindo, ${firstName}`
                : panel.stage}
            </Text>
            <Heading level={1} className={styles.title}>
              {panel.title}
            </Heading>
            <Text className={styles.text}>{panel.text}</Text>
          </div>

          <WelcomeStepTrack panels={panels} index={index} />
        </div>

        <div key={index} className={styles.reveal}>
          <ScreenPreviewFrame screen={panel.screen}>
            {welcomePanelDemo(panel.demoKey)}
          </ScreenPreviewFrame>
        </div>
      </div>

      <WizardFooter
        stepCount={panels.length}
        currentStep={index}
        showBack={index > 0}
        onBack={onBack}
        onAdvance={onAdvance}
        advanceLabel={isLast ? 'Ir para minha loja' : 'Continuar'}
      />
    </>
  )
}
