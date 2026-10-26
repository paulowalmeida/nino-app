import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'

export const useAccountLayoutFacade = () => {
  const { consumer } = useConsumerSession()

  return { consumer }
}
