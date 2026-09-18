import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'

import { CheckoutRail } from './CheckoutRail/CheckoutRail'
import { DestinationStep } from './DestinationStep/DestinationStep'
import { ReviewStep } from './ReviewStep/ReviewStep'
import { SaleCart } from './SaleCart/SaleCart'
import { SaleFinishActions } from './SaleFinishActions/SaleFinishActions'
import { SalePaymentDetails } from './SalePaymentDetails/SalePaymentDetails'
import { StepActions } from './StepActions/StepActions'

import styles from './SalePanel.module.css'

export const SalePanel = ({ bare = false }: { bare?: boolean }) => {
  const {
    lines,
    count,
    subtotal,
    deliveryFee,
    total,
    methods,
    method,
    consumerName,
    changeFor,
    changeAmount,
    hasChange,
    isChangeValid,
    suggestedNotes,
    error,
    isSending,
    handleStep,
    setConsumerName,
    setChangeFor,
    setChosen,
    emptyTicket,
    finish,
    step,
    channel,
    setStep,
    setSheet,
    setChannel,
    tableNumber,
    setTableNumber,
    recipient,
    setRecipient,
    addressLookupRequested,
    setAddressLookupRequested,
    canContinue,
    addressSuggestions,
    isSearchingAddress,
    resolveSelectedAddress,
    isResolvingSelectedAddress,
  } = useCounterFacade()

  const goNext = () => {
    if (step === 'items') setStep('destination')
    else if (step === 'destination') setStep('payment')
    else if (step === 'payment') setStep('review')
    else finish()
  }

  const goBack = () => {
    if (step === 'destination') setStep('items')
    if (step === 'payment') setStep('destination')
    if (step === 'review') setStep('payment')
  }

  const isReview = step === 'review'

  const actions = !isReview ? (
    <StepActions
      subtotal={subtotal}
      deliveryFee={deliveryFee}
      total={total}
      canContinue={canContinue}
      onBack={step !== 'items' ? goBack : undefined}
      onContinue={goNext}
    />
  ) : (
    <SaleFinishActions
      bare={bare}
      hasLines={count > 0}
      isPaymentAvailable={method !== null && isChangeValid}
      isCash={method === 'CASH'}
      total={total}
      isSending={isSending}
      error={error}
      onClear={emptyTicket}
      onFinish={finish}
    />
  )

  return (
    <Box className={bare ? styles.bare : styles.panel}>
      {!bare && (
        <Box as="header" direction="row" className={styles.header}>
          <Heading level={2} size="lg" className={styles.title}>
            Venda
          </Heading>
        </Box>
      )}
      {bare && <CheckoutRail current={step} onStep={setStep} />}
      {step === 'items' && (
        <SaleCart
          lines={lines}
          onStep={handleStep}
          bare={bare}
          onAddMore={() => setSheet(false)}
        />
      )}
      {step === 'destination' && (
        <DestinationStep
          channel={channel}
          consumerName={consumerName}
          tableNumber={tableNumber}
          recipient={recipient}
          addressSuggestions={addressSuggestions}
          isSearchingAddress={isSearchingAddress}
          onChannel={setChannel}
          onConsumerName={setConsumerName}
          onTableNumber={setTableNumber}
          onRecipient={setRecipient}
          addressLookupRequested={addressLookupRequested}
          onAddressLookupRequested={setAddressLookupRequested}
          resolveSelectedAddress={resolveSelectedAddress}
          isResolvingSelectedAddress={isResolvingSelectedAddress}
        />
      )}
      {step === 'payment' && count > 0 && (
        <SalePaymentDetails
          changeFor={changeFor}
          changeAmount={changeAmount}
          hasChange={hasChange}
          isChangeValid={isChangeValid}
          suggestedNotes={suggestedNotes}
          onChangeFor={setChangeFor}
          methods={methods}
          method={method}
          onMethod={setChosen}
        />
      )}
      {step === 'review' && (
        <ReviewStep
          lines={lines}
          channel={channel}
          consumerName={
            channel === 'DELIVERY' || channel === 'PICKUP'
              ? recipient.name
              : consumerName
          }
          tableNumber={tableNumber}
          recipient={recipient}
          method={method}
          changeFor={changeFor}
          changeAmount={changeAmount}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
        />
      )}
      {step === 'payment' && error && <Text color="danger">{error}</Text>}
      {actions}
    </Box>
  )
}
