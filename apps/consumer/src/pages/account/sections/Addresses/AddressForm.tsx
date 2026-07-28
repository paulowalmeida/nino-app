import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { maskZipCode } from '@nino/ds/masks'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'

import type { AddressFormProps } from './AddressForm.types'

import styles from './Addresses.module.css'
import section from '../section.module.css'

const EMPTY: SaveAddressRequest = {
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

/**
 * O mesmo formulário abre para criar e para editar — o que muda é de onde os
 * valores vêm. Fica na página, não num modal: quem está conferindo a lista
 * não deveria perdê-la de vista para corrigir um número.
 */
export const AddressForm = ({
  address,
  isSaving,
  hasError,
  onCancel,
  onSubmit,
}: AddressFormProps) => {
  const [form, setForm] = useState<SaveAddressRequest>(
    address
      ? {
          zipCode: address.zipCode,
          street: address.street,
          number: address.number,
          complement: address.complement ?? '',
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
        }
      : EMPTY
  )

  const set =
    (key: keyof SaveAddressRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }))

  const ready =
    form.zipCode.trim().length >= 8 &&
    form.street.trim() !== '' &&
    form.number.trim() !== '' &&
    form.neighborhood.trim() !== '' &&
    form.city.trim() !== '' &&
    form.state.trim() !== ''

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return

    onSubmit({ ...form, complement: form.complement?.trim() || undefined })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={section.field}>
        <label className={section.label} htmlFor="address-zip">
          CEP
        </label>
        <MaskedInput
          id="address-zip"
          mask={maskZipCode}
          placeholder="00000-000"
          autoComplete="postal-code"
          inputMode="numeric"
          value={form.zipCode}
          onChange={set('zipCode')}
        />
      </div>

      <div className={styles.row}>
        <div className={`${section.field} ${styles.grow}`}>
          <label className={section.label} htmlFor="address-street">
            Rua
          </label>
          <Input
            id="address-street"
            autoComplete="address-line1"
            value={form.street}
            onChange={set('street')}
          />
        </div>
        <div className={`${section.field} ${styles.narrow}`}>
          <label className={section.label} htmlFor="address-number">
            Nº
          </label>
          <Input
            id="address-number"
            inputMode="numeric"
            value={form.number}
            onChange={set('number')}
          />
        </div>
      </div>

      <div className={section.field}>
        <label className={section.label} htmlFor="address-complement">
          Complemento <span className={section.hint}>(opcional)</span>
        </label>
        <Input
          id="address-complement"
          placeholder="Apto, bloco ou ponto de referência"
          autoComplete="address-line2"
          value={form.complement ?? ''}
          onChange={set('complement')}
        />
      </div>

      <div className={section.field}>
        <label className={section.label} htmlFor="address-neighborhood">
          Bairro
        </label>
        <Input
          id="address-neighborhood"
          autoComplete="address-level3"
          value={form.neighborhood}
          onChange={set('neighborhood')}
        />
      </div>

      <div className={styles.row}>
        <div className={`${section.field} ${styles.grow}`}>
          <label className={section.label} htmlFor="address-city">
            Cidade
          </label>
          <Input
            id="address-city"
            autoComplete="address-level2"
            value={form.city}
            onChange={set('city')}
          />
        </div>
        <div className={`${section.field} ${styles.narrow}`}>
          <label className={section.label} htmlFor="address-state">
            UF
          </label>
          <Input
            id="address-state"
            maxLength={2}
            autoComplete="address-level1"
            value={form.state}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                state: event.target.value.toUpperCase(),
              }))
            }
          />
        </div>
      </div>

      {hasError && (
        <Alert variant="error" className={section.alert}>
          Não deu para salvar este endereço. Confira os campos e tente de novo.
        </Alert>
      )}

      <div className={section.actions}>
        <button
          type="submit"
          className={section.primary}
          disabled={!ready || isSaving}
        >
          {isSaving ? 'Salvando…' : 'Salvar endereço'}
        </button>
        <button
          type="button"
          className={section.ghost}
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
