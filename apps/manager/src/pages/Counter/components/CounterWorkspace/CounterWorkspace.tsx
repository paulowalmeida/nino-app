import { Box } from '@nino/ds/components/Box'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'

import { OpenOrderBar } from './OpenOrderBar/OpenOrderBar'
import { ProductGrid } from './ProductGrid/ProductGrid'
import { SaleReceiptButton } from './SalePanel/SaleReceiptButton/SaleReceiptButton'

import styles from './CounterWorkspace.module.css'

export const CounterWorkspace = () => {
  const counter = useCounterFacade()
  return (
    <>
      <Box className={styles.floor}>
        <Box as="section" className={styles.menu} aria-label="Cardápio">
          <ProductGrid />
        </Box>
      </Box>
      {counter.count > 0 && <OpenOrderBar />}

      <SaleReceiptButton
        saleReceipt={counter.lastSale}
        isDownloading={counter.isDownloadingReceipt}
        onDownload={counter.downloadReceipt}
        onDismiss={counter.dismissReceipt}
      />
    </>
  )
}
