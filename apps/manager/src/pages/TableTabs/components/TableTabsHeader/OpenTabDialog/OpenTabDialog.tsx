import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
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

  const openTab = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!trimmedLabel) return
    submitOpen(
      { label: trimmedLabel },
      {
        onSuccess: (tab) => {
          setLabel('')
          onClose()
          navigate(`../comandas/${tab.id}`)
        },
      }
    )
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
        <form id={OPEN_TAB_FORM_ID} onSubmit={openTab}>
          <FormField
            label="Mesa ou nome do cliente"
            helperText="É como a comanda aparece na lista."
          >
            <Input
              value={label}
              maxLength={60}
              placeholder="Ex.: Mesa 4"
              onChange={(event) => setLabel(event.target.value)}
            />
          </FormField>
        </form>
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
            Abrir comanda
          </Button>
        </Box>
      }
    />
  )
}
