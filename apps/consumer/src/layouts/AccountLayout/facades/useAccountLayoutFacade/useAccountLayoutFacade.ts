import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'

export const useAccountLayoutFacade = () => {
  const { customer } = useCustomerSession()

  return { customer }
}
