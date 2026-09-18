import { ReactNode, useEffect, useRef, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Select } from '@nino/ds/components/Select'
import { maskZipCode } from '@nino/ds/masks'
import { lookupZipCode, onlyDigits } from '@nino/lib/services/zip-code.service'
import { BRAZIL_STATES } from '@shared/constants/address.constants'

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
  streetField?: ReactNode
  zipCodeLabel?: ReactNode
  streetLabel?: ReactNode
  showCityAndState?: boolean
  onNumberBlur?: () => void
}

export const AddressFields = ({
  value,
  onChange,
  streetField,
  zipCodeLabel = 'CEP',
  streetLabel = 'Logradouro',
  showCityAndState = true,
  onNumberBlur,
}: AddressFieldsProps) => {
  const [lookup, setLookup] = useState<Lookup>('idle')
  const numberRef = useRef<HTMLInputElement>(null)
  const lookupRequest = useRef(0)
  const isMounted = useRef(true)

  useEffect(() => () => {
    isMounted.current = false
  }, [])

  const handleZipChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const requestId = ++lookupRequest.current
    const zipCode = event.target.value
    onChange({ zipCode })

    if (onlyDigits(zipCode).length !== 8) {
      if (isMounted.current) setLookup('idle')
      return
    }

    if (isMounted.current) setLookup('loading')
    const found = await lookupZipCode(zipCode).catch(() => null)
    if (!isMounted.current || requestId !== lookupRequest.current) return

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
      <FormField label={zipCodeLabel} className={styles.zip}>
        <MaskedInput
          mask={maskZipCode}
          inputMode="numeric"
          autoComplete="postal-code"
          value={value.zipCode}
          onChange={handleZipChange}
        />
      </FormField>

      <FormField label={streetLabel} className={styles.street}>
        {streetField ?? (
          <Input
            autoComplete="address-line1"
            disabled={lookup === 'loading'}
            value={value.street}
            onChange={(event) => onChange({ street: event.target.value })}
          />
        )}
      </FormField>

      <FormField label="Número" className={styles.number}>
        <Input
          ref={numberRef}
          inputMode="numeric"
          value={value.number}
          onChange={(event) => onChange({ number: event.target.value })}
          onBlur={onNumberBlur}
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
          disabled={lookup === 'loading'}
          value={value.neighborhood}
          onChange={(event) => onChange({ neighborhood: event.target.value })}
        />
      </FormField>

      {showCityAndState && (
        <>
          <FormField label="Cidade" className={styles.city}>
            <Input
              disabled={lookup === 'loading'}
              value={value.city}
              onChange={(event) => onChange({ city: event.target.value })}
            />
          </FormField>

          <FormField label="UF" className={styles.state}>
            <Select
              disabled={lookup === 'loading'}
              options={BRAZIL_STATES}
              value={value.state}
              aria-label="Estado do endereço"
              onValueChange={(state) => onChange({ state })}
            />
          </FormField>
        </>
      )}
    </Box>
  )
}
