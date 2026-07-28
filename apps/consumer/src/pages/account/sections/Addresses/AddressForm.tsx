import { useRef, useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { maskZipCode } from '@nino/ds/masks'
import { lookupZipCode, onlyDigits } from '@nino/lib/services/zip-code'
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

type Lookup = 'idle' | 'loading' | 'done' | 'notFound'

/**
 * O mesmo formulário abre para criar e para editar — o que muda é de onde os
 * valores vêm. Fica na página, não num modal: quem está conferindo a lista
 * não deveria perdê-la de vista para corrigir um número.
 *
 * O CEP é quem trabalha aqui. Assim que os oito dígitos estão na mão, ele
 * busca e preenche rua, bairro, cidade e UF, e o cursor pula para o número —
 * a única coisa que o CEP não sabe. Digitar o endereço inteiro à mão na tela
 * do celular é onde a pessoa desiste de salvar onde mora.
 *
 * Nada trava depois da busca: CEP de rua comprida às vezes volta sem
 * logradouro, e o endereço é do morador, não dos Correios.
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
  const [lookup, setLookup] = useState<Lookup>('idle')
  const numberRef = useRef<HTMLInputElement>(null)

  const set =
    (key: keyof SaveAddressRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }))

  /*
   * A busca dispara na digitação, não ao sair do campo: quem acabou de
   * completar o CEP já está indo para o número, e preencher só depois do blur
   * faz o formulário se mexer embaixo do dedo.
   */
  const handleZip = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setForm((current) => ({ ...current, zipCode: value }))

    if (onlyDigits(value).length !== 8) {
      setLookup('idle')
      return
    }

    setLookup('loading')
    const found = await lookupZipCode(value).catch(() => null)

    if (!found) {
      setLookup('notFound')
      return
    }

    /* o que veio vazio não apaga o que a pessoa já tinha escrito */
    setLookup('done')
    setForm((current) => ({
      ...current,
      street: found.street || current.street,
      neighborhood: found.neighborhood || current.neighborhood,
      city: found.city || current.city,
      state: found.state || current.state,
    }))
    numberRef.current?.focus()
  }

  const ready =
    onlyDigits(form.zipCode).length === 8 &&
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
      <div className={styles.field}>
        <label className={styles.label} htmlFor="address-zip">
          CEP
        </label>
        <div className={styles.zip}>
          <MaskedInput
            id="address-zip"
            mask={maskZipCode}
            placeholder="00000-000"
            autoComplete="postal-code"
            inputMode="numeric"
            className={styles.input}
            value={form.zipCode}
            onChange={handleZip}
          />
        </div>

        {lookup === 'loading' && (
          <p className={styles.zipStatus}>Buscando endereço…</p>
        )}
        {lookup === 'notFound' && (
          <p className={styles.zipStatusError}>
            Não achamos esse CEP. Preencha o endereço abaixo.
          </p>
        )}
      </div>

      <div className={styles.pair}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="address-street">
            Rua
          </label>
          <Input
            id="address-street"
            autoComplete="address-line1"
            className={styles.input}
            value={form.street}
            onChange={set('street')}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="address-number">
            Nº
          </label>
          <Input
            id="address-number"
            ref={numberRef}
            inputMode="numeric"
            className={styles.input}
            value={form.number}
            onChange={set('number')}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="address-complement">
          Complemento <span className={styles.optional}>(opcional)</span>
        </label>
        <Input
          id="address-complement"
          placeholder="Apto, bloco ou ponto de referência"
          autoComplete="address-line2"
          className={styles.input}
          value={form.complement ?? ''}
          onChange={set('complement')}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="address-neighborhood">
          Bairro
        </label>
        <Input
          id="address-neighborhood"
          autoComplete="address-level3"
          className={styles.input}
          value={form.neighborhood}
          onChange={set('neighborhood')}
        />
      </div>

      <div className={styles.pairState}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="address-city">
            Cidade
          </label>
          <Input
            id="address-city"
            autoComplete="address-level2"
            className={styles.input}
            value={form.city}
            onChange={set('city')}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="address-state">
            UF
          </label>
          <Input
            id="address-state"
            maxLength={2}
            autoComplete="address-level1"
            className={styles.input}
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
