import { useWelcomeOnboarding } from '@pages/Welcome/hooks/useWelcomeOnboarding/useWelcomeOnboarding'

export const useWelcomeFacade = () => {
  const { firstName, leave } = useWelcomeOnboarding()

  return { firstName, leave }
}
