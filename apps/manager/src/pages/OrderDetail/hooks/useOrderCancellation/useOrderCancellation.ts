import { useOrderStatus } from '@shared/hooks/order/useOrderStatus/useOrderStatus'

/* WHY: o cancelamento só se dá por encerrado depois que a API aceita — quem
 * fecha a caixa antes da resposta apaga o motivo digitado e obriga a pessoa
 * a escrever tudo de novo quando a chamada falha.
 */
export const useOrderCancellation = (
  unitId: string | null,
  orderId: string
) => {
  const { mutateAsync: changeStatus, isPending } = useOrderStatus(unitId)

  const cancelOrder = async (cancelReason: string) => {
    try {
      await changeStatus({ orderId, status: 'CANCELLED', cancelReason })
      return true
    } catch {
      return false
    }
  }

  return { cancelOrder, isCancelling: isPending }
}
