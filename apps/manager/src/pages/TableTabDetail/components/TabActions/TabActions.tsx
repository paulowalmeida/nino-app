import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { Dialog } from '@nino/ds/components/Dialog'
import { Header } from '@nino/ds/components/Header'
import { CancelTabDialog } from '@pages/TableTabDetail/components/TabActions/CancelTabDialog/CancelTabDialog'
import { TabFinalizedSummary } from '@pages/TableTabDetail/components/TabActions/TabFinalizedSummary/TabFinalizedSummary'
import { TabPaymentForm } from '@pages/TableTabDetail/components/TabActions/TabPaymentForm/TabPaymentForm'
import { TAB_ACTIONS_COPY } from '@pages/TableTabDetail/constants/tableTabDetail.constants'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import motion from '@styles/motion.module.css'
import styles from './TabActions.module.css'

export const TabActions = () => {
  const {
    tab,
    canCancelTab,
    submitClose,
    submitReopen,
    isClosing,
    isReopening,
  } = useTableTabDetailFacade()
  const [isConfirmingClose, setConfirmingClose] = useState(false)
  const [isCancellingTab, setCancellingTab] = useState(false)

  if (!tab) return null

  if (tab.status === 'FINALIZED') {
    return (
      <Card
        variant="flat"
        padding="lg"
        className={`${motion.deal} ${styles.tabActions}`}
      >
        <TabFinalizedSummary />
      </Card>
    )
  }

  const isOpen = tab.status === 'OPEN'
  const copy = TAB_ACTIONS_COPY[tab.status]

  const closeTab = () => {
    submitClose()
    setConfirmingClose(false)
  }

  return (
    <Card
      variant="flat"
      padding="lg"
      className={`${motion.deal} ${styles.tabActions}`}
    >
      <Header
        level={2}
        size="lg"
        title={copy.title}
        description={copy.description}
      />
      {isOpen && (
        <Button onClick={() => setConfirmingClose(true)}>Fechar comanda</Button>
      )}
      {!isOpen && <TabPaymentForm />}
      {!isOpen && (
        <Button
          variant="outline"
          loading={isReopening}
          onClick={() => submitReopen()}
        >
          Reabrir comanda
        </Button>
      )}
      {canCancelTab && (
        <Button variant="ghost" onClick={() => setCancellingTab(true)}>
          Cancelar comanda
        </Button>
      )}
      <Dialog
        open={isConfirmingClose}
        onOpenChange={(open) => !open && setConfirmingClose(false)}
        title="Fechar a comanda?"
        description="Os itens e o total ficam congelados até o pagamento. Dá para reabrir se algo mudar."
        confirmLabel="Fechar comanda"
        cancelLabel="Voltar"
        onConfirm={closeTab}
        onCancel={() => setConfirmingClose(false)}
        loading={isClosing}
      />
      <CancelTabDialog
        open={isCancellingTab}
        onClose={() => setCancellingTab(false)}
      />
    </Card>
  )
}
