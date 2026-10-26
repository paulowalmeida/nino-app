import { Header } from '@nino/ds/components/Header'

import motion from '@styles/motion.module.css'

export const SubscriptionHeader = () => (
  <Header
    mb={{ mobile: 5, desktop: 8 }}
    className={motion.deal}
    title="Assinatura e plano"
    accent="plano"
    description="A assinatura é da empresa e vale para todas as unidades."
  />
)
