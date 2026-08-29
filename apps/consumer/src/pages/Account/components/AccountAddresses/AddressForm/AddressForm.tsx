import { useRef, useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Text } from '@nino/ds/components/Text'
import { toast } from '@nino/ds/components/Toast'
import { maskZipCode } from '@nino/ds/masks'
import { lookupZipCode, onlyDigits } from '@nino/lib/services/zip-code.service'
import type { Address } from '@custom_types/address/address'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { addressSaveRequest } from '@pages/account/adapters/addressSaveRequest.adapter/addressSaveRequest.adapter'
import { useAccountFacade } from '@pages/account/facades/useAccountFacade/useAccountFacade'

import styles from './AddressForm.module.css'

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

type AddressFormProps = {
  address?: Address
  onCancel: () => void
  onDone: () => void
}

export const AddressForm = ({
  address,
  onCancel,
  onDone,
}: AddressFormProps) => {
  const { saveAddress, isSavingAddress, hasSaveAddressError } =
    useAccountFacade()

  const [form, setForm] = useState<SaveAddressRequest>(
    address
      ? { ...addressSaveRequest(address), complement: address.complement ?? '' }
      : EMPTY
  )
  const [lookup, setLookup] = useState<Lookup>('idle')
  const numberRef = useRef<HTMLInputElement>(null)

  const set =
    (key: keyof SaveAddressRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }))

  // WHY: dispara na digitação, não no blur — quem acabou de completar o CEP
  // já está indo para o número, e preencher só depois do blur faz o
  // formulário se mexer embaixo do dedo.
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

    // WORKAROUND: CEP de rua comprida às vezes volta sem logradouro; o valor
    // vazio da API não sobrescreve o que a pessoa já tinha escrito.
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

    saveAddress(
      {
        id: address?.id,
        data: { ...form, complement: form.complement?.trim() || undefined },
      },
      {
        onSuccess: () => {
          onDone()
          toast.success(address ? 'Endereço atualizado.' : 'Endereço salvo.')
        },
      }
    )
  }

  return (
    <Box as="form" className={styles.form} onSubmit={handleSubmit}>
      <FormField
        label="CEP"
        labelVariant="compact"
        error={
          lookup === 'notFound'
            ? 'Não achamos esse CEP. Preencha o endereço abaixo.'
            : undefined
        }
        helperText={lookup === 'loading' ? 'Buscando endereço…' : undefined}
      >
        <Box className={styles.zip}>
          <MaskedInput
            mask={maskZipCode}
            placeholder="00000-000"
            autoComplete="postal-code"
            inputMode="numeric"
            className={styles.input}
            value={form.zipCode}
            onChange={handleZip}
          />
        </Box>
      </FormField>

      <Box className={styles.pair}>
        <FormField label="Rua" labelVariant="compact">
          <Input
            autoComplete="address-line1"
            className={styles.input}
            value={form.street}
            onChange={set('street')}
          />
        </FormField>
        <FormField label="Nº" labelVariant="compact">
          <Input
            ref={numberRef}
            inputMode="numeric"
            className={styles.input}
            value={form.number}
            onChange={set('number')}
          />
        </FormField>
      </Box>

      <FormField
        label={
          <>
            Complemento{' '}
            <Text as="span" className={styles.optional}>
              (opcional)
            </Text>
          </>
        }
        labelVariant="compact"
      >
        <Input
          placeholder="Apto, bloco ou ponto de referência"
          autoComplete="address-line2"
          className={styles.input}
          value={form.complement ?? ''}
          onChange={set('complement')}
        />
      </FormField>

      <FormField label="Bairro" labelVariant="compact">
        <Input
          autoComplete="address-level3"
          className={styles.input}
          value={form.neighborhood}
          onChange={set('neighborhood')}
        />
      </FormField>

      <Box className={styles.pairState}>
        <FormField label="Cidade" labelVariant="compact">
          <Input
            autoComplete="address-level2"
            className={styles.input}
            value={form.city}
            onChange={set('city')}
          />
        </FormField>
        <FormField label="UF" labelVariant="compact">
          <Input
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
        </FormField>
      </Box>

      {hasSaveAddressError && (
        <Alert variant="error" className={styles.alert}>
          Não deu para salvar este endereço. Confira os campos e tente de novo.
        </Alert>
      )}

      <Box className={styles.actions}>
        <Button
          type="submit"
          className={styles.primary}
          disabled={!ready || isSavingAddress}
        >
          {isSavingAddress ? 'Salvando…' : 'Salvar endereço'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={styles.ghost}
          onClick={onCancel}
          disabled={isSavingAddress}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  )
}
