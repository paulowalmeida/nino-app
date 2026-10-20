import { Header } from '@nino/ds/components/Header'

import motion from '@styles/motion.module.css'

export const SubscriptionInterestHeader = () => (
  <Header
    mb={{ mobile: 5, desktop: 8 }}
    className={motion.deal}
    title="Plano Rede"
    accent="Rede"
    description="Conte o que sua operação precisa para receber uma proposta personalizada."
  />
)
