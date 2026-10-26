import { type KeyboardEvent, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'

import styles from './PositionNameEditor.module.css'

type PositionNameEditorProps = {
  name: string
}

export const PositionNameEditor = ({ name }: PositionNameEditorProps) => {
  const { renamePosition } = usePositionDetailFacade()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  const startEditing = () => {
    setDraft(name)
    setIsEditing(true)
  }

  const commit = () => {
    const renamed = draft.trim()
    setIsEditing(false)
    if (renamed && renamed !== name) {
      renamePosition(renamed).catch(() => undefined)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit()
    if (event.key === 'Escape') setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={draft}
        maxLength={40}
        aria-label="Nome do cargo"
        className={styles.input}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    )
  }

  return (
    <Box direction="row" align="center" gap={2} className={styles.title}>
      <Heading level={1} accent size="xl">
        {name}
      </Heading>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Editar nome do cargo"
        onClick={startEditing}
      >
        <Icon name="pencil" />
      </Button>
    </Box>
  )
}
