import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Spinner } from '@nino/ds/components/Spinner'
import { TabActions } from '@pages/TableTabDetail/components/TabActions/TabActions'
import { TabDetailHero } from '@pages/TableTabDetail/components/TabDetailHero/TabDetailHero'
import { TabReceipt } from '@pages/TableTabDetail/components/TabReceipt/TabReceipt'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import { BackLink } from '@shared/components/BackLink/BackLink'

import styles from './TableTabDetail.module.css'

export const TableTabDetail = () => {
  const { tab, isPending, isError } = useTableTabDetailFacade()
  const isReady = !isPending && !isError

  return (
    <Box as="main" className={styles.tableTabDetailPage}>
      <BackLink>Voltar para comandas</BackLink>
      <Spinner visible={isPending} size={24} label="Carregando comanda" />
      {isError && (
        <Alert variant="error">
          Não foi possível carregar esta comanda. Tente novamente.
        </Alert>
      )}
      {isReady && !tab && (
        <Alert variant="info">Esta comanda não foi encontrada.</Alert>
      )}
      {isReady && tab && (
        <>
          <TabDetailHero />
          <Box className={styles.tableTabDetailBody}>
            <TabReceipt />
            <TabActions />
          </Box>
        </>
      )}
    </Box>
  )
}
