import { Box } from '@nino/ds/components/Box'
import { Drawer } from '@nino/ds/components/Drawer'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'

import { CouponTab } from './CouponTab/CouponTab'
import { ProductGrid } from './ProductGrid/ProductGrid'
import { SalePanel } from './SalePanel/SalePanel'

import styles from './CounterWorkspace.module.css'

export const CounterWorkspace = () => {
  const counter = useCounterFacade()

  return (
    <>
      <Box className={styles.floor}>
        <Box as="section" className={styles.menu} aria-label="Cardápio">
          <ProductGrid />
        </Box>

        {counter.isDesktop && (
          <Box as="aside" className={styles.sale}>
            <SalePanel />
          </Box>
        )}
      </Box>

      {!counter.isDesktop && counter.count > 0 && <CouponTab />}

      <Drawer
        open={counter.sheet && !counter.isDesktop && counter.count > 0}
        onOpenChange={counter.setSheet}
        placement="bottom"
        size="auto"
        title="Comanda"
        description={`${counter.count} ${counter.count === 1 ? 'item' : 'itens'}`}
        contentClassName={styles.sheet}
        bodyClassName={styles.sheetBody}
      >
        <Box as="aside" className={styles.saleBare}>
          <SalePanel bare />
        </Box>
      </Drawer>
    </>
  )
}
