import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import type { UnitPhone } from '@shared/types/settings/unit-phone'
import { formatPhone, toE164 } from '@shared/utils/phone/phone'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import local from './PhoneList.module.css'

export type PhoneListProps = {
  phones: UnitPhone[]
  isPending: boolean
  onEdit: (data: { id: string; phone: string }) => void
  onRemove: (phone: UnitPhone) => void
}

export const PhoneList = ({
  phones,
  isPending,
  onEdit,
  onRemove,
}: PhoneListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const startEdit = (entry: { id: string; phone: string }) => {
    setEditingId(entry.id)
    setDraft(formatPhone(entry.phone))
  }

  const commitEdit = () => {
    if (!editingId || draft.replace(/\D/g, '').length < 10) return
    onEdit({ id: editingId, phone: toE164(draft) })
    setEditingId(null)
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <Box as="section" className={local.phoneListSection}>
      <Box
        as="header"
        direction="row"
        align="center"
        justify="between"
        className={local.phonesHeader}
      >
        <Heading level={3} size="md">
          Telefones cadastrados
        </Heading>
        <Text size="sm" color="subtle" className={local.phonesMeta}>
          {phones.length === 1 ? '1 telefone' : `${phones.length} telefones`}
        </Text>
      </Box>

      {phones.length === 0 && (
        <EmptyState className={local.phoneListEmpty}>
          Adicione um número para que os clientes saibam como falar com a loja.
        </EmptyState>
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
                <Box direction="row" wrap className={local.editRow}>
                  <PhoneInput
                    aria-label="Telefone da loja"
                    className={local.phoneListInput}
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
                    Cancelar
                  </Button>
                </Box>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className={local.number}
                    onClick={() => startEdit(entry)}
                  >
                    {formatPhone(entry.phone)}
                  </Button>
                  <Box direction="row" className={local.phoneListActions}>
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
                      onClick={() => onRemove(entry)}
                    >
                      Remover
                    </Button>
                  </Box>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </Box>
  )
}
