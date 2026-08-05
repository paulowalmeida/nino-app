import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Skeleton } from '@nino/ds/components/Skeleton'
import type { TenantPhone } from '@custom_types/settings/tenant-phone'
import { formatPhone, toE164 } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'

import local from './PhoneList.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

export type PhoneListProps = {
  phones: TenantPhone[]
  isPending: boolean
  isAdding: boolean
  onAdd: (phone: string) => void
  onEdit: (id: string, phone: string) => void
  onRemove: (id: string) => void
}

export const PhoneList = ({
  phones,
  isPending,
  isAdding,
  onAdd,
  onEdit,
  onRemove,
}: PhoneListProps) => {
  const [phone, setPhone] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const startEdit = (entry: { id: string; phone: string }) => {
    setEditingId(entry.id)
    setDraft(formatPhone(entry.phone))
  }

  const commitEdit = () => {
    if (!editingId || draft.replace(/\D/g, '').length < 10) return
    onEdit(editingId, toE164(draft))
    setEditingId(null)
  }

  const handleAdd = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) return
    onAdd(toE164(phone))
    setPhone('')
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <section className={styles.panel}>
      <header className={`${motion.unroll} ${styles.head}`}>
        <h2 className={styles.title}>Telefones da loja</h2>
        <p className={styles.hint}>
          É por onde o cliente liga quando o pedido some — e onde a equipe
          atende o pedido por telefone.
        </p>
      </header>

      {phones.length === 0 && (
        <EmptyState>Nenhum telefone cadastrado.</EmptyState>
      )}

      {phones.length > 0 && (
        <ul className={local.phones}>
          {phones.map((entry, index) => (
            <li
              key={entry.id}
              className={`${motion.deal} ${local.phone}`}
              style={riseDelay(index * 45 + 60)}
            >
              {editingId === entry.id ? (
                <div className={local.editRow}>
                  <PhoneInput
                    aria-label="Telefone da loja"
                    className={local.input}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                  <Button
                    size="sm"
                    className={motion.press}
                    onClick={commitEdit}
                  >
                    Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    Voltar
                  </Button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className={local.number}
                    onClick={() => startEdit(entry)}
                  >
                    {formatPhone(entry.phone)}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${motion.press} ${local.edit}`}
                    onClick={() => startEdit(entry)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${motion.press} ${local.remove}`}
                    onClick={() => onRemove(entry.id)}
                  >
                    Remover
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className={local.add}>
        <PhoneInput
          value={phone}
          className={local.input}
          onChange={(event) => setPhone(event.target.value)}
        />
        <Button loading={isAdding} className={motion.press} onClick={handleAdd}>
          Adicionar telefone
        </Button>
      </div>
    </section>
  )
}
