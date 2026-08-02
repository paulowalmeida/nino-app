import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'

import type { RemoveUnitModalProps } from './RemoveUnitModal.types'

import styles from './RemoveUnitModal.module.css'

/**
 * Fechar uma loja apaga o histórico dela junto — não é o tipo de coisa que se
 * desfaz com um "voltar". Por isso a confirmação não é um segundo botão do
 * lado do primeiro: quem está fechando tem de escrever o nome da unidade, do
 * mesmo jeito que o GitHub pede o nome do repositório. O gesto de copiar o
 * nome é o que obriga a olhar qual loja está prestes a sumir.
 */
export const RemoveUnitModal = ({
  open,
  onOpenChange,
  unitName,
  loading,
  onConfirm,
}: RemoveUnitModalProps) => {
  const [typed, setTyped] = useState('')

  /* cada abertura começa do zero — o nome digitado antes não vale para a
     próxima loja, e sobrar texto no campo é meio caminho para o engano. O
     ajuste é na render, não num efeito: o campo nunca chega a pintar com o
     texto da loja anterior */
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

          {/* a dica fica acima do campo, junto do rótulo: o nome tem de estar
              à vista na hora de digitar, não abaixo do que se digitou */}
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
