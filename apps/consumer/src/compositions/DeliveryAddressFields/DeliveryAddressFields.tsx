import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'

import { Collapsible } from '@nino/ds/components/Collapsible'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Select } from '@nino/ds/components/Select'
import { maskZipCode } from '@nino/ds/masks'
import { DisclosureTrigger } from '@elements/DisclosureTrigger/DisclosureTrigger'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/public-delivery-zone'
import type { CheckoutFormValues } from '@custom_types/checkout/checkout-form-values'
import { brl } from '@utils/money'

import styles from './DeliveryAddressFields.module.css'

type DeliveryAddressFieldsProps = {
  control: Control<CheckoutFormValues>
  register: UseFormRegister<CheckoutFormValues>
  errors: FieldErrors<CheckoutFormValues>
  zones: PublicDeliveryZone[]
}

/** Zona de entrega + endereço — a metade do formulário que só existe quando
    o pedido sai da loja. */
export const DeliveryAddressFields = ({
  control,
  register,
  errors,
  zones,
}: DeliveryAddressFieldsProps) => (
  <div className={styles.block}>
    <p className={styles.blockLabel}>Onde entregar</p>

    <FormField error={errors.deliveryZoneId?.message}>
      <Controller
        name="deliveryZoneId"
        control={control}
        rules={{ required: 'Escolha a região da entrega' }}
        render={({ field }) => (
          <Select
            placeholder="Região da entrega"
            error={!!errors.deliveryZoneId}
            options={zones.map((zone) => ({
              value: zone.id,
              label: `${zone.name} — ${brl(zone.fee)}`,
            }))}
            value={field.value}
            onValueChange={field.onChange}
          />
        )}
      />
    </FormField>

    <div className={styles.row}>
      <FormField error={errors.guestStreet?.message}>
        <Input
          placeholder="Rua"
          aria-label="Rua"
          autoComplete="address-line1"
          error={!!errors.guestStreet}
          {...register('guestStreet', { required: 'Informe a rua' })}
        />
      </FormField>
      <FormField error={errors.guestNumber?.message}>
        <Input
          placeholder="Nº"
          aria-label="Número"
          inputMode="numeric"
          error={!!errors.guestNumber}
          {...register('guestNumber', { required: 'Informe o nº' })}
        />
      </FormField>
    </div>

    <FormField error={errors.guestNeighborhood?.message}>
      <Input
        placeholder="Bairro"
        aria-label="Bairro"
        autoComplete="address-level3"
        error={!!errors.guestNeighborhood}
        {...register('guestNeighborhood', {
          required: 'Informe o bairro',
        })}
      />
    </FormField>

    <Collapsible
      className={styles.disclosure}
      trigger={
        <DisclosureTrigger>Complemento, referência ou CEP</DisclosureTrigger>
      }
    >
      <div className={styles.disclosureFields}>
        <Input
          placeholder="Apto, bloco ou ponto de referência"
          aria-label="Complemento ou ponto de referência"
          autoComplete="address-line2"
          {...register('guestComplement')}
        />
        <MaskedInput
          mask={maskZipCode}
          placeholder="CEP"
          aria-label="CEP"
          autoComplete="postal-code"
          {...register('guestZipCode')}
        />
      </div>
    </Collapsible>
  </div>
)
