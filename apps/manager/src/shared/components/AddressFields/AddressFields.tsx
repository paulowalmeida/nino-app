import { useRef, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { lookupZipCode, onlyDigits } from '@nino/lib/services/zip-code.service'

import styles from './AddressFields.module.css'

type Lookup = 'idle' | 'loading' | 'done' | 'notFound'

type AddressValue = {
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

type AddressFieldsProps = {
  value: AddressValue
  onChange: (patch: Partial<AddressValue>) => void
}

export const AddressFields = ({ value, onChange }: AddressFieldsProps) => {
  const [lookup, setLookup] = useState<Lookup>('idle')
  const numberRef = useRef<HTMLInputElement>(null)

  const handleZipChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const zipCode = event.target.value
    onChange({ zipCode })

    if (onlyDigits(zipCode).length !== 8) {
      setLookup('idle')
      return
    }

    setLookup('loading')
    const found = await lookupZipCode(zipCode).catch(() => null)

    if (!found) {
      setLookup('notFound')
      return
    }

    setLookup('done')
    onChange({
      street: found.street || value.street,
      neighborhood: found.neighborhood || value.neighborhood,
      city: found.city || value.city,
      state: found.state || value.state,
    })
    numberRef.current?.focus()
  }

  return (
    <Box className={styles.grid}>
      <FormField label="CEP" className={styles.zip}>
        <Input
          inputMode="numeric"
          autoComplete="postal-code"
          value={value.zipCode}
          onChange={handleZipChange}
        />
        {lookup === 'loading' && (
          <Text className={styles.status}>Buscando endereço…</Text>
        )}
        {lookup === 'notFound' && (
          <Text className={styles.statusError}>
            Não achamos esse CEP. Preencha o endereço abaixo.
          </Text>
        )}
      </FormField>

      <FormField label="Rua" className={styles.street}>
        <Input
          autoComplete="address-line1"
          value={value.street}
          onChange={(event) => onChange({ street: event.target.value })}
        />
      </FormField>

      <FormField label="Número" className={styles.number}>
        <Input
          ref={numberRef}
          inputMode="numeric"
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
    </Box>
  )
}
