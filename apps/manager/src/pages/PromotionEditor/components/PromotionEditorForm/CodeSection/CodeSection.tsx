import { useState } from 'react'

import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Chip } from '@nino/ds/components/Chip'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Switch } from '@nino/ds/components/Switch'
import { PROMOTION_PAYMENT_METHODS } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { PAYMENT_METHOD_LABEL } from '@shared/constants/order.constants'

import styles from './CodeSection.module.css'

const CODE_PATTERN = /^[A-Z0-9_-]*$/

export const CodeSection = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<PromotionFormValues>()
  const code = useWatch({ control, name: 'code' })
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

        <Box className={styles.codeFields}>
          <FormField
            label="Código (opcional)"
            helperText={
              code
                ? 'O desconto só vale para quem digitar este cupom.'
                : 'Sem código, o cliente aplica o desconto pela lista de cupons do cardápio.'
            }
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
                  placeholder="Ex.: BEMVINDO10"
                  autoCapitalize="characters"
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    const code = event.target.value
                      .toUpperCase()
                      .replace(/\s/g, '')
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

          <Controller
            name="firstOrderOnly"
            control={control}
            render={({ field }) => (
              <FormField
                label="Só no 1º pedido"
                helperText="Vale para quem ainda não comprou na loja, logado ou pelo telefone."
                orientation="horizontal"
              >
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Só no 1º pedido"
                />
              </FormField>
            )}
          />

          <Controller
            name="paymentMethods"
            control={control}
            render={({ field }) => (
              <FormField
                label="Formas de pagamento"
                helperText="Nenhuma marcada vale para todas."
              >
                <Box
                  direction="row"
                  role="group"
                  aria-label="Formas de pagamento com desconto"
                  className={styles.paymentChips}
                >
                  <Chip
                    type="button"
                    variant="toggle"
                    selected={field.value.length === 0}
                    onClick={() => field.onChange([])}
                  >
                    Todas
                  </Chip>
                  {PROMOTION_PAYMENT_METHODS.map((method) => (
                    <Chip
                      key={method}
                      type="button"
                      variant="toggle"
                      selected={field.value.includes(method)}
                      onClick={() =>
                        field.onChange(
                          field.value.includes(method)
                            ? field.value.filter(
                                (current) => current !== method
                              )
                            : [...field.value, method]
                        )
                      }
                    >
                      {PAYMENT_METHOD_LABEL[method]}
                    </Chip>
                  ))}
                </Box>
              </FormField>
            )}
          />
        </Box>
      </Card>
    </Box>
  )
}
