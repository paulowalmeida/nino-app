import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { Separator } from '@nino/ds/components/Separator'
import { Text } from '@nino/ds/components/Text'
import { OpenTabTablePicker } from '@pages/TableTabs/components/TableTabsHeader/OpenTabDialog/OpenTabTablePicker/OpenTabTablePicker'
import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'

import styles from './OpenTabDialog.module.css'

const OPEN_TAB_FORM_ID = 'open-tab-form'

type OpenTabDialogProps = {
  open: boolean
  onClose: () => void
}

export const OpenTabDialog = ({ open, onClose }: OpenTabDialogProps) => {
  const { submitOpen, isOpening } = useTableTabsFacade()
  const navigate = useNavigate()
  const [label, setLabel] = useState('')
  const trimmedLabel = label.trim()

  const goToTab = (tabId: string) => {
    setLabel('')
    onClose()
    navigate(`../comandas/${tabId}`)
  }

  const openTab = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!trimmedLabel) return
    submitOpen({ label: trimmedLabel }, { onSuccess: (tab) => goToTab(tab.id) })
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !next && onClose()}
      ariaLabel="Abrir comanda"
      header={
        <Heading level={2} size="md">
          Abrir comanda
        </Heading>
      }
      body={
        <Box className={styles.openTabDialogBody}>
          <Box className={styles.openTabDialogSection}>
            <Text weight="semibold">Escolha a mesa</Text>
            <Text size="sm" color="muted">
              Mesa ocupada leva à comanda que já está aberta nela.
            </Text>
            <OpenTabTablePicker onTabReady={goToTab} />
          </Box>
          <Separator />
          <form id={OPEN_TAB_FORM_ID} onSubmit={openTab}>
            <FormField
              label="Comanda sem mesa"
              helperText="Para balcão ou bar: use o nome do cliente."
            >
              <Input
                value={label}
                maxLength={60}
                placeholder="Ex.: Seu João"
                onChange={(event) => setLabel(event.target.value)}
              />
            </FormField>
          </form>
        </Box>
      }
      footer={
        <Box direction="row" className={styles.openTabDialogActions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form={OPEN_TAB_FORM_ID}
            loading={isOpening}
            disabled={!trimmedLabel}
          >
            Abrir pelo nome
          </Button>
        </Box>
      }
    />
  )
}
