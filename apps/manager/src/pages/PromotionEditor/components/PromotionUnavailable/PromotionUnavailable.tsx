import { useNavigate } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'

export const PromotionUnavailable = () => {
  const navigate = useNavigate()

  return (
    <EmptyState
      title="Esta campanha não pode ser editada"
      action={
        <Button onClick={() => void navigate('..', { relative: 'path' })}>
          Voltar para promoções
        </Button>
      }
    >
      Depois do primeiro uso, ou de finalizada, a campanha só pode ser pausada,
      finalizada ou duplicada.
    </EmptyState>
  )
}
