import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { toast } from '@nino/ds/components/Toast'
import { FormBuilder } from '@nino/forms/FormBuilder'
import type { Address } from '@custom_types/address/address'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { addressSaveRequest } from '@pages/Addresses/adapters/addressSaveRequest.adapter/addressSaveRequest.adapter'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import { AddressFormActions } from './AddressFormActions/AddressFormActions'
import { AddressFormFields } from './AddressFormFields/AddressFormFields'
import type { AddressLookupStatus } from '@pages/Addresses/types/AddressLookupStatus.type'
import styles from './AddressForm.module.css'

const EMPTY: SaveAddressRequest = {
  zipCode: '',
  street: '',
  number: '',
  complement: undefined,
  neighborhood: '',
  city: '',
  state: '',
}

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
  const {
    saveAddress,
    isSavingAddress,
    hasSaveAddressError,
    lookupAddress,
    isLookingUpAddress,
  } = useAddressesFacade()
  const [lookup, setLookup] = useState<AddressLookupStatus>('idle')
  const defaultValues: SaveAddressRequest = address
    ? { ...addressSaveRequest(address), complement: address.complement ?? '' }
    : EMPTY

  const handleSubmit = (form: SaveAddressRequest) =>
    saveAddress(
      {
        id: address?.id,
        data: form,
      },
      {
        onSuccess: () => {
          onDone()
          toast.success(address ? 'Endereço atualizado.' : 'Endereço salvo.')
        },
      }
    )

  return (
    <FormBuilder<SaveAddressRequest>
      defaultValues={defaultValues}
      formOptions={{ mode: 'onChange' }}
      onSubmit={handleSubmit}
      formProps={{ className: styles.addressForm }}
    >
      {(form) => (
        <>
          <AddressFormFields
            form={form}
            lookup={lookup}
            isLookingUp={isLookingUpAddress}
            lookupAddress={lookupAddress}
            onLookupChange={setLookup}
          />
          {hasSaveAddressError && (
            <Alert variant="error" className={styles.alert}>
              Não deu para salvar este endereço. Confira os campos e tente de
              novo.
            </Alert>
          )}
          <AddressFormActions
            isSaving={isSavingAddress}
            isValid={form.formState.isValid}
            onCancel={onCancel}
          />
        </>
      )}
    </FormBuilder>
  )
}
