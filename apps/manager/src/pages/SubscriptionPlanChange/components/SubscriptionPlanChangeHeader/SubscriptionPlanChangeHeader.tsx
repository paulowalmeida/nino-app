import { useNavigate, useParams } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'

import motion from '@styles/motion.module.css'

type SubscriptionPlanChangeHeaderProps = {
  isConfirmation: boolean
}

export const SubscriptionPlanChangeHeader = ({
  isConfirmation,
}: SubscriptionPlanChangeHeaderProps) => {
  const navigate = useNavigate()
  const { unitId } = useParams()
  const subscriptionPath = `/${unitId}/assinatura`

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() =>
          navigate(
            isConfirmation ? `${subscriptionPath}/planos` : subscriptionPath
          )
        }
      >
        Voltar
      </Button>
      <Header
        mb={{ mobile: 5, desktop: 8 }}
        className={motion.deal}
        title={isConfirmation ? 'Confirmar alteração' : 'Escolha um plano'}
        accent={isConfirmation ? 'alteração' : 'plano'}
        description={
          isConfirmation
            ? 'Revise a alteração antes de confirmar para todas as unidades.'
            : 'Compare os limites e selecione o plano que atende a empresa.'
        }
      />
    </>
  )
}
