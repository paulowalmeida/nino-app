import { Controller, type Control } from 'react-hook-form'

import { RadioGroup } from '@nino/ds/components/RadioGroup'
import type { CheckoutFormValues } from '@custom_types/checkout/checkout-form-values'

import styles from './ChannelFields.module.css'

type ChannelFieldsProps = {
  control: Control<CheckoutFormValues>
  hasDeliveryZones: boolean
  deliveryNote: string
}

/** Entrega só aparece como opção quando a loja tem zona cadastrada. */
export const ChannelFields = ({
  control,
  hasDeliveryZones,
  deliveryNote,
}: ChannelFieldsProps) => (
  <div className={styles.block}>
    <p className={styles.blockLabel}>Como receber</p>
    <Controller
      name="channel"
      control={control}
      render={({ field }) => (
        <RadioGroup
          variant="card"
          orientation="horizontal"
          aria-label="Como receber"
          value={field.value}
          onValueChange={field.onChange}
          options={[
            ...(hasDeliveryZones
              ? [
                  {
                    value: 'DELIVERY',
                    label: 'Entrega',
                    description: deliveryNote,
                  },
                ]
              : []),
            {
              value: 'PICKUP',
              label: 'Retirada',
              description: 'Você busca na loja',
            },
          ]}
        />
      )}
    />
  </div>
)
