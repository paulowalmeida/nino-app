import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'

import styles from './RemoveUnitModal.module.css'

export type RemoveUnitModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Name the person has to type — the same one shown in the list. */
  unitName: string
  loading?: boolean
  onConfirm: () => void
}

/**
 * Closing a store wipes its history along with it — not the kind of thing
 * that undoes with a "go back". That's why the confirmation isn't a second
 * button next to the first: whoever is closing it has to type the unit
 * name, the same way GitHub asks for the repository name. The act of
 * copying the name is what forces a look at which store is about to
 * disappear.
 */
export const RemoveUnitModal = ({
  open,
  onOpenChange,
  unitName,
  loading,
  onConfirm,
}: RemoveUnitModalProps) => {
  const [typed, setTyped] = useState('')

  /* Every opening starts from zero — the name typed before doesn't carry
     over to the next store, and leftover text in the field is halfway to a
     mistake. The reset happens during render, not in an effect: the field
     never gets to paint with the previous store's text. */
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    setTyped('')
  }

  const matches = typed.trim() === unitName.trim()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (matches && !loading) onConfirm()
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      ariaLabel={`Fechar a loja ${unitName}`}
      header={<h2 className={styles.title}>Excluir esta loja?</h2>}
      body={
        <form
          id="remove-unit-form"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <Alert variant="error">
            A loja sai da empresa e o histórico dela vai junto. Não dá para
            desfazer.
          </Alert>

          {/* The hint sits above the field, next to the label: the name
              needs to stay visible while typing, not below what was
              already typed. */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="remove-unit-name">
              Para confirmar, digite <code className={styles.code}>
                {unitName}
              </code> abaixo:
            </label>
            <Input
              id="remove-unit-name"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
            />
          </div>
        </form>
      }
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="remove-unit-form"
            className={styles.danger}
            loading={loading}
            disabled={!matches}
          >
            Confirmar
          </Button>
        </>
      }
    />
  )
}
