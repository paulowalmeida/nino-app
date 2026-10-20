import { useNavigate } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'

import motion from '@styles/motion.module.css'
import styles from './SubscriptionInterestSent.module.css'

export const SubscriptionInterestSent = () => {
  const navigate = useNavigate()

  return (
    <Box
      gap={5}
      className={`${motion.deal} ${styles.subscriptionInterestSent}`}
    >
      <Alert variant="success" title="Solicitação enviada">
        Recebemos os detalhes da sua operação. Nossa equipe vai analisar o
        cenário e entrar em contato pelo canal escolhido.
      </Alert>
      <Button
        type="button"
        variant="outline"
        onClick={() => void navigate('..', { relative: 'path' })}
      >
        Voltar para assinatura
      </Button>
    </Box>
  )
}
