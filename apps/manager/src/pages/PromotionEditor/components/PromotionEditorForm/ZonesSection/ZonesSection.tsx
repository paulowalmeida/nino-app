import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import { ZONE_SCOPE_OPTIONS } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import styles from './ZonesSection.module.css'

const toggleZone = (zoneIds: string[], zoneId: string, checked: boolean) =>
  checked ? [...zoneIds, zoneId] : zoneIds.filter((id) => id !== zoneId)

export const ZonesSection = () => {
  const { zoneOptions } = usePromotionEditorFacade()
  const {
    control,
    formState: { errors },
  } = useFormContext<PromotionFormValues>()
  const zoneScope = useWatch({ control, name: 'zoneScope' })

  return (
    <Box as="section" aria-labelledby="campaign-zones">
      <Card variant="flat" padding="lg" className={styles.zonesSection}>
        <Heading level={2} size="sm" id="campaign-zones">
          Zonas de entrega
        </Heading>
        <Text className={styles.zonesLead}>
          Fora delas o frete é o normal, e o cliente vê que a campanha não vale
          para o endereço.
        </Text>

        {zoneOptions.length === 0 ? (
          <Alert variant="warning" title="A unidade não tem zonas ativas">
            Cadastre as zonas de entrega em Configurações para o frete grátis
            ter efeito.
          </Alert>
        ) : (
          <>
            <Controller
              name="zoneScope"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  aria-label="Onde a campanha vale"
                  options={ZONE_SCOPE_OPTIONS}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />

            {zoneScope === 'chosen' && (
              <Controller
                name="deliveryZoneIds"
                control={control}
                rules={{
                  validate: (zoneIds) =>
                    zoneIds.length > 0 || 'Marque pelo menos uma zona',
                }}
                render={({ field }) => (
                  <Box className={styles.zoneList}>
                    {zoneOptions.map((zone) => (
                      <FormField
                        key={zone.value}
                        label={zone.label}
                        orientation="horizontal"
                      >
                        <Checkbox
                          checked={field.value.includes(zone.value)}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              toggleZone(
                                field.value,
                                zone.value,
                                checked === true
                              )
                            )
                          }
                        />
                      </FormField>
                    ))}
                    {errors.deliveryZoneIds && (
                      <Text role="alert" className={styles.zonesError}>
                        {errors.deliveryZoneIds.message}
                      </Text>
                    )}
                  </Box>
                )}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  )
}
