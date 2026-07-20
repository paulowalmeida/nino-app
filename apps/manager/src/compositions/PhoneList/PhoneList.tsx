import { useState } from 'react'

import { Button, PhoneInput, Skeleton } from '@nino/ds'

import { formatPhone, toE164 } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'

import type { PhoneListProps } from './PhoneList.types'

import local from './PhoneList.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

export const PhoneList = ({
  phones,
  isPending,
  isAdding,
  onAdd,
  onRemove,
}: PhoneListProps) => {
  const [phone, setPhone] = useState('')

  const handleAdd = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) return
    onAdd(toE164(phone))
    setPhone('')
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <section className={styles.card}>
      <header className={`${motion.unroll} ${styles.head}`}>
        <h2 className={styles.title}>Telefones da loja</h2>
        <p className={styles.hint}>
          É por onde o cliente liga quando o pedido some — e onde a equipe
          atende o pedido por telefone.
        </p>
      </header>

      {phones.length === 0 && (
        <p className={styles.empty}>Nenhum telefone cadastrado.</p>
      )}

      {phones.length > 0 && (
        <ul className={local.phones}>
          {phones.map((entry, index) => (
            <li
              key={entry.id}
              className={`${motion.deal} ${local.phone}`}
              style={riseDelay(index * 45 + 60)}
            >
              <span className={local.number}>
                {formatPhone(entry.phone)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={`${motion.press} ${local.remove}`}
                onClick={() => onRemove(entry.id)}
              >
                Remover
              </Button>
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
        <Button
          loading={isAdding}
          className={motion.press}
          onClick={handleAdd}
        >
          Adicionar telefone
        </Button>
      </div>
    </section>
  )
}
