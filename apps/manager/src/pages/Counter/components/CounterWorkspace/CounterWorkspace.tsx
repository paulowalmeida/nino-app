import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'

import { OpenOrderBar } from './OpenOrderBar/OpenOrderBar'
import { ProductGrid } from './ProductGrid/ProductGrid'
import { SalePanel } from './SalePanel/SalePanel'
import { SaleReceiptButton } from './SalePanel/SaleReceiptButton/SaleReceiptButton'

import styles from './CounterWorkspace.module.css'

export const CounterWorkspace = () => {
  const counter = useCounterFacade()
  const previousStep = () => {
    const previous = {
      destination: 'items',
      payment: 'destination',
      review: 'payment',
    } as const
    const step = previous[counter.step as keyof typeof previous]
    if (step) counter.setStep(step)
  }

  const isFirstStep = counter.step === 'items'

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

      <Modal
        open={counter.sheet && counter.count > 0}
        onOpenChange={counter.setSheet}
        ariaLabel="Pedido"
        size="lg"
        contentClassName={styles.sheet}
        body={
          <Box className={styles.sheetBody}>
            <Box
              direction="row"
              align="start"
              gap={2}
              className={styles.sheetTitle}
            >
              <Button
                type="button"
                variant="ghost"
                aria-label="Voltar um passo"
                onClick={previousStep}
                disabled={isFirstStep}
                className={styles.sheetBack}
              >
                <Icon name="arrow-left" size="sm" />
              </Button>
              <Box direction="column" gap={0.5}>
                <Heading level={2} size="lg">
                  Pedido
                </Heading>
                <Text size="sm" color="muted">
                  {counter.count} {counter.count === 1 ? 'item' : 'itens'}
                </Text>
              </Box>
            </Box>
            <SalePanel bare />
          </Box>
        }
      />
    </>
  )
}
