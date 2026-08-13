import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Flexbox } from '@nino/ds/components/Flexbox'
import { BrandTopBar } from '@components/BrandTopBar/BrandTopBar'
import {
  WelcomeOnboardingPanel,
} from '@compositions/WelcomeOnboardingPanel/WelcomeOnboardingPanel'
import { WELCOME_PANELS } from '@constants/welcome.constants'
import { useSessionStore } from '@states/useSessionStore'
import { rememberOnboarding } from '@utils/onboarding-seen'

import styles from './Welcome.module.css'

export const Welcome = () => {
  const navigate = useNavigate()
  const user = useSessionStore((state) => state.user)
  const firstName = (user?.name ?? '').split(' ')[0]

  const [index, setIndex] = useState(0)
  const isLast = index === WELCOME_PANELS.length - 1

  const leave = () => {
    rememberOnboarding()
    void navigate('/unidades')
  }

  const advance = () => (isLast ? leave() : setIndex((current) => current + 1))
  const back = () => setIndex((current) => current - 1)

  return (
    <Flexbox direction="column" className={styles.shell}>
      <BrandTopBar actionLabel="Pular" onAction={leave} />

      <Flexbox as="main" direction="column" className={styles.page}>
        <WelcomeOnboardingPanel
          panels={WELCOME_PANELS}
          index={index}
          firstName={firstName}
          isLast={isLast}
          onAdvance={advance}
          onBack={back}
        />
      </Flexbox>
    </Flexbox>
  )
}
