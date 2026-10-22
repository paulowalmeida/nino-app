import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Chip } from '@nino/ds/components/Chip'
import { DatePicker } from '@nino/ds/components/DatePicker'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import { TimePicker } from '@nino/ds/components/TimePicker'
import { combineDateTime } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { PROMOTION_WEEKDAY_LABELS } from '@shared/constants/promotion.constants'

import styles from './PeriodSection.module.css'

const toggleWeekday = (weekdays: number[], day: number) =>
  weekdays.includes(day)
    ? weekdays.filter((weekday) => weekday !== day)
    : [...weekdays, day]

export const PeriodSection = () => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<PromotionFormValues>()
  const hasDailyWindow = useWatch({ control, name: 'hasDailyWindow' })

  const endsAfterStart = (endsAtDate: Date | undefined) => {
    const end = combineDateTime(endsAtDate, getValues('endsAtTime'))
    const start = combineDateTime(
      getValues('startsAtDate'),
      getValues('startsAtTime')
    )
    return !end || !start || end > start || 'O fim precisa ser depois do início'
  }

  return (
    <Box as="section" aria-labelledby="campaign-period">
      <Card variant="flat" padding="lg" className={styles.periodSection}>
        <Heading level={2} size="sm" id="campaign-period">
          Quando vale
        </Heading>

        <Box className={styles.periodRow}>
          <FormField label="Início" error={errors.startsAtDate?.message} required>
            <Box direction="row" className={styles.dateTime}>
              <Controller
                name="startsAtDate"
                control={control}
                rules={{ required: 'Escolha o dia de início' }}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Controller
                name="startsAtTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    className={styles.time}
                    ariaLabel="Hora de início"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </Box>
          </FormField>

          <FormField
            label="Fim"
            helperText="Sem fim, vale até você pausar ou finalizar."
            error={errors.endsAtDate?.message}
          >
            <Box direction="row" className={styles.dateTime}>
              <Controller
                name="endsAtDate"
                control={control}
                rules={{ validate: endsAfterStart }}
                render={({ field }) => (
                  <DatePicker
                    placeholder="Sem fim"
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Controller
                name="endsAtTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    className={styles.time}
                    ariaLabel="Hora de fim"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </Box>
          </FormField>
        </Box>

        <FormField
          label="Dias da semana"
          helperText="Nenhum marcado vale todos os dias."
        >
          <Controller
            name="weekdays"
            control={control}
            render={({ field }) => (
              <Box
                direction="row"
                className={styles.weekdays}
                role="group"
                aria-label="Dias da semana"
              >
                {PROMOTION_WEEKDAY_LABELS.map((label, day) => (
                  <Chip
                    key={label}
                    type="button"
                    variant="toggle"
                    selected={field.value.includes(day)}
                    onClick={() => field.onChange(toggleWeekday(field.value, day))}
                  >
                    {label}
                  </Chip>
                ))}
              </Box>
            )}
          />
        </FormField>

        <Box className={styles.window}>
          <Controller
            name="hasDailyWindow"
            control={control}
            render={({ field }) => (
              <FormField
                label="Só em um horário"
                helperText="Fora dele o frete volta ao normal. No fuso da loja."
                orientation="horizontal"
              >
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Só em um horário"
                />
              </FormField>
            )}
          />

          {hasDailyWindow && (
            <Box direction="row" className={styles.windowTimes}>
              <Controller
                name="dailyStartTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    className={styles.time}
                    ariaLabel="Começa às"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
              <Text as="span" className={styles.windowSeparator}>
                até
              </Text>
              <Controller
                name="dailyEndTime"
                control={control}
                rules={{
                  validate: (end) =>
                    end !== getValues('dailyStartTime') ||
                    'O horário precisa ter início e fim diferentes',
                }}
                render={({ field }) => (
                  <TimePicker
                    className={styles.time}
                    ariaLabel="Termina às"
                    value={field.value}
                    error={!!errors.dailyEndTime}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </Box>
          )}
          {errors.dailyEndTime && (
            <Text role="alert" className={styles.periodError}>
              {errors.dailyEndTime.message}
            </Text>
          )}
        </Box>
      </Card>
    </Box>
  )
}
