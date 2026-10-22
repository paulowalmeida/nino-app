import { useState } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Switch } from '@nino/ds/components/Switch'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

import styles from './CodeSection.module.css'

const CODE_PATTERN = /^[A-Z0-9_-]*$/

export const CodeSection = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<PromotionFormValues>()
  /* WHY: não dá para usar o `isDirty` do campo — ele volta a falso quando o
   * gestor liga e desliga de novo, e aí o código voltaria a mandar. */
  const [isVisibilityChosen, setVisibilityChosen] = useState(false)

  const followCode = (code: string) => {
    if (!isVisibilityChosen) setValue('showInMenu', !code)
  }

  return (
    <Box as="section" aria-labelledby="campaign-code">
      <Card variant="flat" padding="lg" className={styles.codeSection}>
        <Heading level={2} size="sm" id="campaign-code">
          Quem pode usar
        </Heading>

        <FormField
          label="Código"
          helperText="Sem código, vale para todos. Com código, só para quem digitar."
          error={errors.code?.message}
          className={styles.codeField}
        >
          <Controller
            name="code"
            control={control}
            rules={{
              maxLength: { value: 40, message: 'Use até 40 caracteres' },
              pattern: {
                value: CODE_PATTERN,
                message: 'Use só letras, números, - e _',
              },
            }}
            render={({ field }) => (
              <Input
                placeholder="Opcional, ex.: FRETEJA"
                autoCapitalize="characters"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const code = event.target.value.toUpperCase().replace(/\s/g, '')
                  field.onChange(code)
                  followCode(code)
                }}
              />
            )}
          />
        </FormField>

        <Controller
          name="showInMenu"
          control={control}
          render={({ field }) => (
            <FormField
              label="Mostrar no cardápio"
              helperText="Faixa no topo do cardápio com a condição da campanha."
              orientation="horizontal"
              className={styles.visibility}
            >
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  setVisibilityChosen(true)
                  field.onChange(checked)
                }}
                aria-label="Mostrar no cardápio"
              />
            </FormField>
          )}
        />
      </Card>
    </Box>
  )
}
