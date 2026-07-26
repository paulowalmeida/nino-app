import { useState } from 'react'

import { Button, Input } from '@nino/ds'

import pencilIcon from '@assets/icons/pencil.svg?raw'
import trashIcon from '@assets/icons/trash.svg?raw'
import { Icon } from '@components/Icon/Icon'
import { riseDelay } from '@utils/rise-delay'

import type { CategoryRowProps } from './Categories.types'

import styles from './Categories.module.css'
import motion from '@styles/motion.module.css'

const countLabel = (count: number): string =>
  count === 1 ? '1 item' : `${count} itens`

export const CategoryRow = ({
  category,
  index,
  isRenaming,
  onRename,
  onDelete,
  disabled,
}: CategoryRowProps) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(category.name)
  const empty = category.count === 0

  const closeEditing = () => {
    setEditing(false)
    setDraft(category.name)
  }

  /* Em falha o formulário fica aberto com o texto digitado; o toast explica. */
  const submit = async () => {
    const name = draft.trim()
    if (!name || name === category.name) return closeEditing()
    try {
      await onRename(name)
      setEditing(false)
    } catch {
      /* nada a fazer aqui: o nome antigo continua valendo na lista */
    }
  }

  return (
    <li
      className={`${motion.deal} ${styles.row}`}
      style={riseDelay(index * 35 + 60)}
    >
      {editing ? (
        <form
          className={styles.editForm}
          onSubmit={(event) => {
            event.preventDefault()
            void submit()
          }}
        >
          <Input
            autoFocus
            value={draft}
            aria-label={`Novo nome para ${category.name}`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === 'Escape' && closeEditing()}
          />
          <Button size="sm" type="submit" loading={isRenaming}>
            Salvar
          </Button>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            disabled={isRenaming}
            onClick={closeEditing}
          >
            Cancelar
          </Button>
        </form>
      ) : (
        <>
          <div className={styles.who}>
            <span className={styles.name}>{category.name}</span>
            <span className={empty ? styles.hintEmpty : styles.hint}>
              {empty ? 'Vazia — nenhum item ainda' : countLabel(category.count)}
            </span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${motion.press} ${styles.action}`}
              aria-label={`Renomear ${category.name}`}
              disabled={disabled}
              onClick={() => setEditing(true)}
            >
              <Icon svg={pencilIcon} />
            </button>
            <button
              type="button"
              className={`${motion.press} ${styles.action} ${styles.danger}`}
              aria-label={`Excluir ${category.name}`}
              disabled={disabled}
              onClick={onDelete}
            >
              <Icon svg={trashIcon} />
            </button>
          </div>
        </>
      )}
    </li>
  )
}
