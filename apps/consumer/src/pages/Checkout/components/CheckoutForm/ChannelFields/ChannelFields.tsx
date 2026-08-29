import { Controller } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import styles from './ChannelFields.module.css'

/** Entrega só aparece como opção quando a loja tem zona cadastrada. */
export const ChannelFields = () => {
  const { control, zones, deliveryNote } = useCheckoutFacade()
  const hasDeliveryZones = zones.length > 0

  return (
    <Box className={styles.block}>
      <Text className={styles.blockLabel}>Como receber</Text>
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
    </Box>
  )
}
