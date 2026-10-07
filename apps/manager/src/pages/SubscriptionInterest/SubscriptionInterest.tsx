import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'

import { useSubscriptionFacade } from '../Subscription/facades/useSubscriptionFacade/useSubscriptionFacade'
import { SubscriptionInterestForm } from './components/SubscriptionInterestForm/SubscriptionInterestForm'

import motion from '@styles/motion.module.css'
import styles from './SubscriptionInterest.module.css'

export const SubscriptionInterest = () => {
  const navigate = useNavigate()
  const { requestInterest, isRequestingInterest, isRequestInterestError } =
    useSubscriptionFacade()
  const [submitted, setSubmitted] = useState(false)

  return (
    <Box className={styles.subscriptionInterestPage}>
      <Header
        mb={{ mobile: 5, desktop: 8 }}
        title="Plano Rede"
        accent="Rede"
        description="Conte o que sua operação precisa para receber uma proposta personalizada."
      />

      {submitted ? (
        <Box gap={5} className={`${motion.settle} ${styles.success}`}>
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
      ) : (
        <SubscriptionInterestForm
          requestInterest={requestInterest}
          isRequestingInterest={isRequestingInterest}
          isRequestInterestError={isRequestInterestError}
          onSuccess={() => setSubmitted(true)}
          onCancel={() => void navigate('..', { relative: 'path' })}
        />
      )}
    </Box>
  )
}
