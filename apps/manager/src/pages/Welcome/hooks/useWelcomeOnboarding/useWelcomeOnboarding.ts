import { useNavigate } from 'react-router'

import { useSessionStore } from '@shared/states/session/session.state'
import { firstName } from '@shared/utils/firstName/firstName'
import { rememberOnboarding } from '@shared/utils/onboarding-seen/onboarding-seen'

export const useWelcomeOnboarding = () => {
  const navigate = useNavigate()
  const userName = useSessionStore((state) => state.user?.name ?? '')

  const leave = () => {
    rememberOnboarding()
    void navigate('/unidades')
  }

  return { firstName: firstName(userName), leave }
}
