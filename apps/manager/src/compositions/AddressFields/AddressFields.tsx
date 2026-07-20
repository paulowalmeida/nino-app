import { FormField, Input } from '@nino/ds'

import type { AddressFieldsProps } from './AddressFields.types'

import styles from './AddressFields.module.css'

/** Endereço em uma malha só, reaproveitada por empresa e unidade. */
export const AddressFields = ({ value, onChange }: AddressFieldsProps) => (
  <div className={styles.grid}>
    <FormField label="CEP" className={styles.zip}>
      <Input
        inputMode="numeric"
        value={value.zipCode}
        onChange={(event) => onChange({ zipCode: event.target.value })}
      />
    </FormField>

    <FormField label="Rua" className={styles.street}>
      <Input
        value={value.street}
        onChange={(event) => onChange({ street: event.target.value })}
      />
    </FormField>

    <FormField label="Número" className={styles.number}>
      <Input
        value={value.number}
        onChange={(event) => onChange({ number: event.target.value })}
      />
    </FormField>

    <FormField label="Complemento" className={styles.complement}>
      <Input
        value={value.complement}
        onChange={(event) => onChange({ complement: event.target.value })}
      />
    </FormField>

    <FormField label="Bairro" className={styles.neighborhood}>
      <Input
        value={value.neighborhood}
        onChange={(event) => onChange({ neighborhood: event.target.value })}
      />
    </FormField>

    <FormField label="Cidade" className={styles.city}>
      <Input
        value={value.city}
        onChange={(event) => onChange({ city: event.target.value })}
      />
    </FormField>

    <FormField label="UF" className={styles.state}>
      <Input
        maxLength={2}
        value={value.state}
        onChange={(event) =>
          onChange({ state: event.target.value.toUpperCase() })
        }
      />
    </FormField>
  </div>
)
