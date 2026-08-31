import { ChannelFields } from './ChannelFields/ChannelFields'
import { CheckoutAlerts } from './CheckoutAlerts/CheckoutAlerts'
import { CheckoutFooter } from './CheckoutFooter/CheckoutFooter'
import { CheckoutHeader } from './CheckoutHeader/CheckoutHeader'
import { CheckoutReceipt } from './CheckoutReceipt/CheckoutReceipt'
import { DeliveryAddressFields } from './DeliveryAddressFields/DeliveryAddressFields'
import { GuestContactFields } from './GuestContactFields/GuestContactFields'
import { OrderNotesField } from './OrderNotesField/OrderNotesField'
import { PaymentMethodFields } from './PaymentMethodFields/PaymentMethodFields'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { riseDelay } from '@utils/rise-delay'
import { Box } from '@nino/ds/components/Box'
import { FormBuilder } from '@nino/forms/FormBuilder'
import type { CheckoutFormValues } from '@custom_types/checkout/checkout-form-values'

import styles from './CheckoutForm.module.css'
import motion from '@styles/motion.module.css'

type CheckoutFormProps = {
  backHref: string
  storeName: string
  isStoreOpen: boolean
  checkout?: CheckoutFacade
}

export const CheckoutForm = ({
  backHref,
  storeName,
  isStoreOpen,
  checkout,
}: CheckoutFormProps) => {
  const facade = useCheckoutFacade(checkout)
  const { form, onSubmit, isDelivery, submitFailed } = facade

  return (
    <FormBuilder<CheckoutFormValues>
      form={form}
      onSubmit={onSubmit}
      formProps={{ className: styles.form }}
    >
      {() => (
        <>
          <CheckoutHeader backHref={backHref} storeName={storeName} />
          <Box as="section" className={motion.riseIn} style={riseDelay(20)}>
            <CheckoutReceipt checkout={facade} />
          </Box>
          <Box as="section" className={motion.riseIn} style={riseDelay(70)}>
            <ChannelFields checkout={facade} />
          </Box>
          {isDelivery && (
            <Box as="section" className={motion.riseIn} style={riseDelay(20)}>
              <DeliveryAddressFields checkout={facade} />
            </Box>
          )}
          <Box as="section" className={motion.riseIn} style={riseDelay(120)}>
            <GuestContactFields checkout={facade} />
          </Box>
          <Box as="section" className={motion.riseIn} style={riseDelay(170)}>
            <PaymentMethodFields checkout={facade} />
          </Box>
          <Box as="section" className={motion.riseIn} style={riseDelay(220)}>
            <OrderNotesField checkout={facade} />
          </Box>
          <CheckoutAlerts
            isSubmitFailed={submitFailed}
            isStoreClosed={!isStoreOpen}
          />
          <CheckoutFooter disabled={!isStoreOpen} checkout={facade} />
        </>
      )}
    </FormBuilder>
  )
}
