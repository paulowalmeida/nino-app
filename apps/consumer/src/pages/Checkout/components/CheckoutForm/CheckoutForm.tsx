import { useState } from 'react'
import type { FieldPath } from 'react-hook-form'

import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Stepper } from '@nino/ds/components/Stepper'
import { Text } from '@nino/ds/components/Text'
import { FormBuilder } from '@nino/forms/FormBuilder'
import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'
import { PAYMENT_METHOD_LABEL } from '@pages/checkout/constants/paymentMethodLabel.constants'

import { ChannelFields } from './ChannelFields/ChannelFields'
import { CheckoutAlerts } from './CheckoutAlerts/CheckoutAlerts'
import { CheckoutFooter } from './CheckoutFooter/CheckoutFooter'
import { CheckoutHeader } from './CheckoutHeader/CheckoutHeader'
import { CheckoutReceipt } from './CheckoutReceipt/CheckoutReceipt'
import { DeliveryAddressFields } from './DeliveryAddressFields/DeliveryAddressFields'
import { GuestContactFields } from './GuestContactFields/GuestContactFields'
import { OrderNotesField } from './OrderNotesField/OrderNotesField'
import { PaymentMethodFields } from './PaymentMethodFields/PaymentMethodFields'

import styles from './CheckoutForm.module.css'

const CHECKOUT_STEPS = [
  { title: 'Recebimento' },
  { title: 'Contato' },
  { title: 'Pagamento' },
  { title: 'Revisão' },
]

type CheckoutFormProps = {
  backHref: string
  storeName: string
  storeLogoUrl?: string | null
  isStoreOpen: boolean
  checkout?: CheckoutFacade
}

export const CheckoutForm = ({
  backHref,
  storeName,
  storeLogoUrl,
  isStoreOpen,
  checkout,
}: CheckoutFormProps) => {
  const facade = useCheckoutFacade(checkout)
  const {
    form,
    onSubmit,
    isDelivery,
    submitFailed,
    submitErrorMessage,
    isBelowMinimum,
    minimumOrderAmount,
  } = facade
  const [step, setStep] = useState(0)
  const [furthestStep, setFurthestStep] = useState(0)
  const isLastStep = step === CHECKOUT_STEPS.length - 1

  const fieldsForStep = (): FieldPath<CheckoutFormValues>[] => {
    if (step === 0 && isDelivery) {
      return facade.isAuthenticated
        ? ['deliveryZoneId', 'deliveryAddressId']
        : [
            'deliveryZoneId',
            'guestZipCode',
            'guestStreet',
            'guestNumber',
            'guestNeighborhood',
            'guestCity',
            'guestState',
          ]
    }
    if (step === 1) return ['guestName', 'guestPhone']
    return []
  }

  const goNext = async () => {
    const isValid = await form.trigger(fieldsForStep(), { shouldFocus: true })
    if (!isValid) return

    const nextStep = Math.min(step + 1, CHECKOUT_STEPS.length - 1)
    setStep(nextStep)
    setFurthestStep((current) => Math.max(current, nextStep))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setStep((current) => Math.max(current - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToCompletedStep = (nextStep: number) => {
    if (nextStep > furthestStep) return
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const values = form.getValues()

  return (
    <FormBuilder<CheckoutFormValues>
      form={form}
      onSubmit={(submittedValues) => {
        if (!isLastStep) {
          void goNext()
          return
        }
        onSubmit(submittedValues)
      }}
      formProps={{ className: styles.form }}
    >
      {() => (
        <>
          <CheckoutHeader
            backHref={backHref}
            storeName={storeName}
            storeLogoUrl={storeLogoUrl}
          />
          <Box className={styles.workspace}>
            <Box as="aside" className={styles.summary} aria-label="Seu pedido">
              <Box className={styles.receiptArea}>
                <CheckoutReceipt checkout={facade} />
              </Box>
              <Box className={styles.alertsArea}>
                <CheckoutAlerts
                  isSubmitFailed={submitFailed}
                  submitErrorMessage={submitErrorMessage}
                  isStoreClosed={!isStoreOpen}
                  isBelowMinimum={isBelowMinimum}
                  minimumOrderAmount={minimumOrderAmount}
                />
              </Box>
              <Box className={styles.footerArea}>
                <CheckoutFooter
                  disabled={!isStoreOpen || isBelowMinimum}
                  isLastStep={isLastStep}
                  canGoBack={step > 0}
                  onBack={goBack}
                  onContinue={() => void goNext()}
                  checkout={facade}
                />
              </Box>
            </Box>

            <Box className={styles.details}>
              <Stepper
                steps={CHECKOUT_STEPS}
                step={step}
                onStepChange={goToCompletedStep}
                className={styles.stepper}
              />

              <Box as="section" className={styles.stepContent}>
                {step === 0 && (
                  <Box className={styles.stepFields}>
                    <ChannelFields checkout={facade} />
                    {isDelivery && <DeliveryAddressFields checkout={facade} />}
                  </Box>
                )}
                {step === 1 && <GuestContactFields checkout={facade} />}
                {step === 2 && (
                  <Box className={styles.stepFields}>
                    <PaymentMethodFields checkout={facade} />
                    <OrderNotesField checkout={facade} />
                  </Box>
                )}
                {step === 3 && (
                  <Box className={styles.review}>
                    <Box className={styles.mobileReceipt}>
                      <CheckoutReceipt checkout={facade} />
                    </Box>
                    <Box>
                      <Heading level={2} size="md">
                        Tudo certo para enviar?
                      </Heading>
                      <Text color="muted">
                        Confira os dados e confirme o pedido.
                      </Text>
                    </Box>
                    <dl className={styles.reviewList}>
                      <Box className={styles.reviewRow}>
                        <dt><Text color="muted">Recebimento</Text></dt>
                        <dd>
                          <Text weight="semibold">
                            {values.channel === 'DELIVERY'
                              ? 'Entrega'
                              : 'Retirada'}
                          </Text>
                        </dd>
                      </Box>
                      <Box className={styles.reviewRow}>
                        <dt><Text color="muted">Contato</Text></dt>
                        <dd>
                          <Text weight="semibold">
                            {values.guestName} · {values.guestPhone}
                          </Text>
                        </dd>
                      </Box>
                      <Box className={styles.reviewRow}>
                        <dt><Text color="muted">Pagamento</Text></dt>
                        <dd>
                          <Text weight="semibold">
                            {PAYMENT_METHOD_LABEL[values.paymentMethod]}
                          </Text>
                        </dd>
                      </Box>
                    </dl>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </FormBuilder>
  )
}
