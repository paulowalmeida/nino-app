import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'

import { SaleCart } from './SaleCart/SaleCart'
import { SaleFinishActions } from './SaleFinishActions/SaleFinishActions'
import { SalePaymentDetails } from './SalePaymentDetails/SalePaymentDetails'
import { SaleReceiptButton } from './SaleReceiptButton/SaleReceiptButton'

import styles from './SalePanel.module.css'

export const SalePanel = ({ bare = false }: { bare?: boolean }) => {
  const {
    lines,
    count,
    total,
    methods,
    method,
    customerName,
    changeFor,
    changeAmount,
    hasChange,
    isChangeValid,
    suggestedNotes,
    error,
    isSending,
    handleStep,
    setCustomerName,
    setChangeFor,
    setChosen,
    emptyTicket,
    finish,
    lastSale,
    dismissReceipt,
  } = useCounterFacade()

  return (
    <Box className={bare ? styles.bare : styles.panel}>
      {!bare && (
        <Box as="header" direction="row" className={styles.header}>
          <Heading level={2} size="lg" className={styles.title}>
            Venda
          </Heading>
        </Box>
      )}
      <SaleCart lines={lines} onStep={handleStep} />
      {count > 0 && method && (
        <SalePaymentDetails
          customerName={customerName}
          changeFor={changeFor}
          changeAmount={changeAmount}
          hasChange={hasChange}
          isChangeValid={isChangeValid}
          suggestedNotes={suggestedNotes}
          onCustomerName={setCustomerName}
          onChangeFor={setChangeFor}
          methods={methods}
          method={method}
          onMethod={setChosen}
        />
      )}
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
      <SaleReceiptButton saleReceipt={lastSale} onDismiss={dismissReceipt} />
    </Box>
  )
}
