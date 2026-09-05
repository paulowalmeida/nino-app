import { Alert } from '@nino/ds/components/Alert'
import { brl } from '@utils/money'

type CheckoutAlertsProps = {
  isSubmitFailed: boolean
  isStoreClosed: boolean
  isBelowMinimum?: boolean
  minimumOrderAmount?: number
}

export const CheckoutAlerts = ({
  isSubmitFailed,
  isStoreClosed,
  isBelowMinimum,
  minimumOrderAmount = 0,
}: CheckoutAlertsProps) => (
  <>
    {isSubmitFailed && (
      <Alert variant="error" title="O pedido não foi enviado">
        Confira os campos marcados e toque em confirmar de novo.
      </Alert>
    )}

    {isStoreClosed && (
      <Alert variant="warning" title="A loja está fechada agora">
        Sua sacola fica guardada — volte quando ela reabrir.
      </Alert>
    )}

    {isBelowMinimum && (
      <Alert variant="warning" title="Pedido abaixo do mínimo">
        Adicione mais itens para chegar a {brl(minimumOrderAmount)}.
      </Alert>
    )}
  </>
)
