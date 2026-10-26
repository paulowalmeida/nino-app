import { type ReactNode, useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { Input } from '@nino/ds/components/Input'

import motion from '@styles/motion.module.css'
import styles from './InlineEditCell.module.css'

type InlineEditCellProps = {
  display: ReactNode
  value: string
  label: string
  inputMode: 'numeric' | 'decimal'
  mask?: (value: string) => string
  /** Devolve o valor salvo, ou `null` quando o texto não é aceito. */
  parse: (value: string) => number | null
  onStartEdit?: () => void
  onCommit: (value: number) => void
  onReject: () => void
}

/* WHY: edita no lugar e salva ao sair do campo — sem modal nem botão de
 * salvar por linha. Esc desfaz; valor inválido volta ao anterior e avisa. */
export const InlineEditCell = ({
  display,
  value,
  label,
  inputMode,
  mask,
  parse,
  onStartEdit,
  onCommit,
  onReject,
}: InlineEditCellProps) => {
  const [draft, setDraft] = useState<string | null>(null)

  if (draft === null) {
    return (
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Editar ${label}`}
        className={`${motion.press} ${styles.inlineEditTrigger}`}
        onClick={() => {
          setDraft(value)
          onStartEdit?.()
        }}
      >
        {display}
      </Button>
    )
  }

  const commit = () => {
    const parsed = parse(draft)
    setDraft(null)
    if (parsed === null) return onReject()
    if (draft !== value) onCommit(parsed)
  }

  return (
    <Input
      autoFocus
      inputMode={inputMode}
      aria-label={label}
      className={styles.inlineEditInput}
      value={draft}
      onChange={(event) =>
        setDraft(mask ? mask(event.target.value) : event.target.value)
      }
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
        if (event.key === 'Escape') setDraft(null)
      }}
    />
  )
}
