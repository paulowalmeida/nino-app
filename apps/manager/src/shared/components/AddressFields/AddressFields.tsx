import { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Select } from '@nino/ds/components/Select'
import { maskZipCode } from '@nino/ds/masks'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { BRAZIL_STATES } from '@shared/constants/address.constants'

import styles from './AddressFields.module.css'

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
  cityField?: ReactNode
  stateField?: ReactNode
  zipCodeLabel?: ReactNode
  streetLabel?: ReactNode
  showCityAndState?: boolean
  onNumberBlur?: () => void
  /** Places city and state first so address search can use that context. */
  locationFirst?: boolean
  /** Keeps address fields unavailable until a state has been selected. */
  requiresState?: boolean
  /**
   * Which question opens the form. `zipCode` is what a registration asks
   * first; `street` puts the address and the number up front and drops the
   * CEP next to the complement, which is the order a delivery is dictated
   * over the counter.
   */
  leadWith?: 'zipCode' | 'street'
}

export const AddressFields = ({
  value,
  onChange,
  streetField,
  cityField,
  stateField,
  zipCodeLabel = 'CEP',
  streetLabel = 'Endereço',
  showCityAndState = true,
  onNumberBlur,
  leadWith = 'zipCode',
  locationFirst = false,
  requiresState = false,
}: AddressFieldsProps) => {
  const leadsWithStreet = leadWith === 'street'
  const addressDisabled = requiresState && !value.state

  const cityAndStateFields = showCityAndState ? (
    <>
      <FormField label="Estado" className={styles.state}>
        {stateField ?? (
          <Select
            options={BRAZIL_STATES}
            value={value.state}
            aria-label="Estado do endereço"
            onValueChange={(state) => onChange({ state })}
          />
        )}
      </FormField>

      <FormField label="Cidade" className={styles.city}>
        {cityField ?? (
          <Input
            disabled={addressDisabled}
            value={value.city}
            onChange={(event) => onChange({ city: event.target.value })}
          />
        )}
      </FormField>
    </>
  ) : null

  const zipCodeField = (
    <FormField label={zipCodeLabel} className={styles.zip}>
      <MaskedInput
        mask={maskZipCode}
        inputMode="numeric"
        autoComplete="postal-code"
        disabled={addressDisabled}
        value={value.zipCode}
        onChange={(event) => onChange({ zipCode: event.target.value })}
      />
    </FormField>
  )

  const streetAddressField = (
    <FormField label={streetLabel} className={styles.street}>
      {streetField ?? (
        <Input
          autoComplete="address-line1"
          disabled={addressDisabled}
          value={value.street}
          onChange={(event) => onChange({ street: event.target.value })}
        />
      )}
    </FormField>
  )

  const numberField = (
    <FormField label="Número" className={styles.number}>
      <Input
        inputMode="numeric"
        disabled={addressDisabled}
        value={value.number}
        onChange={(event) => onChange({ number: event.target.value })}
        onBlur={onNumberBlur}
      />
    </FormField>
  )

  const complementField = (
    <FormField label="Complemento" className={styles.complement}>
      <Input
        disabled={addressDisabled}
        value={value.complement}
        onChange={(event) => onChange({ complement: event.target.value })}
      />
    </FormField>
  )

  const neighborhoodField = (
    <FormField label="Bairro" className={styles.neighborhood}>
      <Input
        disabled={addressDisabled}
        value={value.neighborhood}
        onChange={(event) => onChange({ neighborhood: event.target.value })}
      />
    </FormField>
  )

  return (
    <Box
      className={mergeClasses(
        styles.addressFieldsGrid,
        leadsWithStreet && styles.streetLed,
        locationFirst && styles.locationFirst
      )}
    >
      {locationFirst ? (
        <>
          {cityAndStateFields}
          {zipCodeField}
          {streetAddressField}
          {numberField}
          {neighborhoodField}
          {complementField}
        </>
      ) : (
        <>
          {!leadsWithStreet && zipCodeField}
          {streetAddressField}
          {numberField}
          {complementField}
          {neighborhoodField}
          {leadsWithStreet && zipCodeField}
          {cityAndStateFields}
        </>
      )}
    </Box>
  )
}
