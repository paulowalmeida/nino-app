import { Input, Select } from '@nino/ds'

import type { RecipientFieldsProps } from './RecipientFields.types'

import styles from './RecipientFields.module.css'
import motion from '@styles/motion.module.css'

/**
 * The order taken over the phone: no account, so the panel writes down who
 * ordered and where it goes. The zone drives the fee, calculated server-side.
 */
export const RecipientFields = ({
  value,
  zones,
  onChange,
}: RecipientFieldsProps) => (
  <div className={`${motion.unroll} ${styles.block}`}>
    <p className={styles.title}>Quem recebe</p>

    <div className={styles.pair}>
      <Input
        placeholder="Nome"
        aria-label="Nome de quem pediu"
        value={value.name}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <Input
        inputMode="tel"
        placeholder="Telefone"
        aria-label="Telefone de quem pediu"
        value={value.phone}
        onChange={(event) => onChange({ phone: event.target.value })}
      />
    </div>

    <div className={styles.pair}>
      <Input
        placeholder="Rua"
        aria-label="Rua"
        className={styles.street}
        value={value.street}
        onChange={(event) => onChange({ street: event.target.value })}
      />
      <Input
        placeholder="Número"
        aria-label="Número"
        value={value.number}
        onChange={(event) => onChange({ number: event.target.value })}
      />
    </div>

    <div className={styles.pair}>
      <Input
        placeholder="Complemento"
        aria-label="Complemento"
        value={value.complement}
        onChange={(event) => onChange({ complement: event.target.value })}
      />
      <Input
        placeholder="Bairro"
        aria-label="Bairro"
        value={value.neighborhood}
        onChange={(event) => onChange({ neighborhood: event.target.value })}
      />
    </div>

    <Select
      options={zones}
      placeholder={
        zones.length > 0 ? 'Região da entrega' : 'Nenhuma região cadastrada'
      }
      value={value.zoneId}
      aria-label="Região da entrega"
      onValueChange={(zoneId) => onChange({ zoneId })}
    />
  </div>
)
