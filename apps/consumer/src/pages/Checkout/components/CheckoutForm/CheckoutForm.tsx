import { ChannelFields } from './ChannelFields/ChannelFields'
import { CheckoutAlerts } from './CheckoutAlerts/CheckoutAlerts'
import { CheckoutFooter } from './CheckoutFooter/CheckoutFooter'
import { CheckoutHeader } from './CheckoutHeader/CheckoutHeader'
import { CheckoutReceipt } from './CheckoutReceipt/CheckoutReceipt'
import { DeliveryAddressFields } from './DeliveryAddressFields/DeliveryAddressFields'
import { GuestContactFields } from './GuestContactFields/GuestContactFields'
import { OrderNotesField } from './OrderNotesField/OrderNotesField'
import { PaymentMethodFields } from './PaymentMethodFields/PaymentMethodFields'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { riseDelay } from '@utils/rise-delay'
import { Box } from '@nino/ds/components/Box'

import styles from './CheckoutForm.module.css'
import motion from '@styles/motion.module.css'

type CheckoutFormProps = {
  backHref: string
  storeName: string
  isStoreOpen: boolean
}

export const CheckoutForm = ({
  backHref,
  storeName,
  isStoreOpen,
}: CheckoutFormProps) => {
  const { submit, isDelivery, submitFailed } = useCheckoutFacade()

  return (
    <form onSubmit={submit} className={styles.form}>
      <CheckoutHeader backHref={backHref} storeName={storeName} />
      <Box as="section" className={motion.riseIn} style={riseDelay(20)}>
        <CheckoutReceipt />
      </Box>
      <Box as="section" className={motion.riseIn} style={riseDelay(70)}>
        <ChannelFields />
      </Box>
      {isDelivery && (
        <Box as="section" className={motion.riseIn} style={riseDelay(20)}>
          <DeliveryAddressFields />
        </Box>
      )}
      <Box as="section" className={motion.riseIn} style={riseDelay(120)}>
        <GuestContactFields />
      </Box>
      <Box as="section" className={motion.riseIn} style={riseDelay(170)}>
        <PaymentMethodFields />
      </Box>
      <Box as="section" className={motion.riseIn} style={riseDelay(220)}>
        <OrderNotesField />
      </Box>
      <CheckoutAlerts
        isSubmitFailed={submitFailed}
        isStoreClosed={!isStoreOpen}
      />
      <CheckoutFooter disabled={!isStoreOpen} />
    </form>
  )
}
