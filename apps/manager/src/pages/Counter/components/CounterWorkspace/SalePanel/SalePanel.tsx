import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'

import { SaleCart } from './SaleCart/SaleCart'
import { SaleFinishActions } from './SaleFinishActions/SaleFinishActions'
import { SalePaymentDetails } from './SalePaymentDetails/SalePaymentDetails'

import styles from './SalePanel.module.css'

export const SalePanel = ({ bare = false }: { bare?: boolean }) => {
  const {
    lines,
    count,
    total,
    methods,
    method,
    customerName,
    tableNumber,
    changeFor,
    changeAmount,
    isChangeValid,
    error,
    isSending,
    handleStep,
    setCustomerName,
    setTableNumber,
    setChangeFor,
    setChosen,
    emptyTicket,
    finish,
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
          tableNumber={tableNumber}
          changeFor={changeFor}
          changeAmount={changeAmount}
          isChangeValid={isChangeValid}
          onCustomerName={setCustomerName}
          onTableNumber={setTableNumber}
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
    </Box>
  )
}
