import { useState } from 'react'

import { SubscriptionInterestForm } from './SubscriptionInterestForm/SubscriptionInterestForm'
import { SubscriptionInterestSent } from './SubscriptionInterestSent/SubscriptionInterestSent'

export const SubscriptionInterestRequest = () => {
  const [isInterestSent, setIsInterestSent] = useState(false)

  if (isInterestSent) return <SubscriptionInterestSent />

  return (
    <SubscriptionInterestForm onInterestSent={() => setIsInterestSent(true)} />
  )
}
