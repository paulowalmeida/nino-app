import { Alert } from '@nino/ds/components/Alert'
import { brl } from '@utils/money/money'

type CheckoutAlertsProps = {
  isSubmitFailed: boolean
  submitErrorMessage?: string
  isStoreClosed: boolean
  isBelowMinimum?: boolean
  minimumOrderAmount?: number
  promotionEndedFee?: number | null
}

export const CheckoutAlerts = ({
  isSubmitFailed,
  submitErrorMessage,
  isStoreClosed,
  isBelowMinimum,
  minimumOrderAmount = 0,
  promotionEndedFee = null,
}: CheckoutAlertsProps) => (
  <>
    {promotionEndedFee !== null && (
      <Alert variant="warning" title="A promoção de frete grátis acabou">
        O frete agora é {brl(promotionEndedFee)}. Confira o total e confirme de
        novo.
      </Alert>
    )}

    {isSubmitFailed && promotionEndedFee === null && (
      <Alert variant="error" title="O pedido não foi enviado">
        {submitErrorMessage ||
          'Não foi possível enviar o pedido. Confira os dados e tente novamente.'}
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
