import { Alert } from '@nino/ds/components/Alert'

type CheckoutAlertsProps = {
  isSubmitFailed: boolean
  isStoreClosed: boolean
}

export const CheckoutAlerts = ({
  isSubmitFailed,
  isStoreClosed,
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
  </>
)
