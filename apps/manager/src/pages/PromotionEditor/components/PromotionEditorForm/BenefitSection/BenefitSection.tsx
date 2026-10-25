import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Select } from '@nino/ds/components/Select'
import { discountAmountOf } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter'
import {
  CAMPAIGN_TYPE_OPTIONS,
  DISCOUNT_KIND_OPTIONS,
} from '@pages/PromotionEditor/constants/promotionEditor.constants'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { maskMoney, moneyValue } from '@shared/utils/money/money'

import styles from './BenefitSection.module.css'

const TYPE_HINTS = {
  'free-delivery': 'A taxa de entrega some do pedido que cumprir a condição.',
  discount: 'Sai do valor dos itens; o frete continua o normal.',
  gift: 'Um produto do cardápio entra no pedido a R$ 0.',
  package: 'O cliente monta só com os produtos e opções que você liberar.',
} as const

export const BenefitSection = () => {
  const { mode, giftProductOptions } = usePromotionEditorFacade()
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<PromotionFormValues>()
  const campaignType = useWatch({ control, name: 'campaignType' })
  const discountKind = useWatch({ control, name: 'discountKind' })
  const isDiscount = campaignType === 'discount'
  const isPackage = campaignType === 'package'
  const isPercentage = discountKind === 'PERCENTAGE_DISCOUNT'

  return (
    <Box as="section" aria-labelledby="campaign-benefit">
      <Card variant="flat" padding="lg" className={styles.benefitSection}>
        <Heading level={2} size="sm" id="campaign-benefit">
          Benefício
        </Heading>

        <Box className={styles.benefitFields}>
          <FormField
            label="Tipo de campanha"
            helperText={TYPE_HINTS[campaignType]}
            className={styles.campaignTypeField}
          >
            <Controller
              name="campaignType"
              control={control}
              render={({ field }) => (
                <Select
                  options={CAMPAIGN_TYPE_OPTIONS}
                  value={field.value}
                  disabled={mode !== 'create'}
                  onValueChange={field.onChange}
                />
              )}
            />
          </FormField>

          {campaignType === 'gift' && (
            <FormField
              label="Produto de brinde"
              helperText="Só aparecem produtos ativos sem escolha obrigatória."
              error={errors.giftProductId?.message}
            >
              <Controller
                name="giftProductId"
                control={control}
                rules={{
                  validate: (productId) =>
                    getValues('campaignType') !== 'gift' ||
                    !!productId ||
                    'Escolha o produto de brinde',
                }}
                render={({ field }) => (
                  <Select
                    options={giftProductOptions}
                    placeholder="Escolha um produto"
                    value={field.value}
                    onValueChange={field.onChange}
                    error={!!errors.giftProductId}
                  />
                )}
              />
            </FormField>
          )}

          {isDiscount && (
            <FormField label="Como desconta">
              <Controller
                name="discountKind"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    aria-label="Como desconta"
                    orientation="horizontal"
                    options={DISCOUNT_KIND_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </FormField>
          )}

          {isDiscount && (
            <FormField
              label={isPercentage ? 'Desconto (%)' : 'Desconto (R$)'}
              error={errors.discountValue?.message}
              className={styles.amountField}
            >
              <Controller
                name="discountValue"
                control={control}
                rules={{
                  validate: (value) => {
                    if (getValues('campaignType') !== 'discount') return true
                    const amount = discountAmountOf({
                      discountKind: getValues('discountKind'),
                      discountValue: value,
                    })
                    if (!(amount > 0)) return 'Informe o desconto'
                    return (
                      getValues('discountKind') !== 'PERCENTAGE_DISCOUNT' ||
                      amount <= 100 ||
                      'O percentual vai até 100'
                    )
                  },
                }}
                render={({ field }) => (
                  <Input
                    inputMode="decimal"
                    placeholder={isPercentage ? '10' : '10,00'}
                    aria-label={
                      isPercentage
                        ? 'Desconto em percentual'
                        : 'Desconto em reais'
                    }
                    value={field.value}
                    error={!!errors.discountValue}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(
                        isPercentage
                          ? event.target.value.replace(/[^\d,]/g, '')
                          : maskMoney(event.target.value)
                      )
                    }
                  />
                )}
              />
            </FormField>
          )}

          {isDiscount && isPercentage && (
            <FormField
              label="Teto do desconto"
              helperText="Opcional. Ex.: 10% até R$ 15,00 protege a margem em pedido grande."
              className={styles.amountField}
            >
              <Controller
                name="maxDiscount"
                control={control}
                render={({ field }) => (
                  <Input
                    inputMode="decimal"
                    placeholder="Sem teto"
                    aria-label="Teto do desconto em reais"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(maskMoney(event.target.value))
                    }
                  />
                )}
              />
            </FormField>
          )}

          {isPackage && (
            <FormField
              label="Preço fechado"
              helperText="A soma normal dos itens aparece riscada no cardápio."
              error={errors.packagePrice?.message}
              className={styles.amountField}
            >
              <Controller
                name="packagePrice"
                control={control}
                rules={{
                  validate: (value) =>
                    getValues('campaignType') !== 'package' ||
                    moneyValue(value) > 0 ||
                    'Informe o preço da promoção',
                }}
                render={({ field }) => (
                  <Input
                    inputMode="decimal"
                    placeholder="49,90"
                    aria-label="Preço fechado da promoção"
                    value={field.value}
                    error={!!errors.packagePrice}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(maskMoney(event.target.value))
                    }
                  />
                )}
              />
            </FormField>
          )}

          <FormField
            label="Pedido mínimo"
            helperText="Conta só os itens, sem o frete. Vazio vale para qualquer pedido."
          >
            <Controller
              name="minOrderValue"
              control={control}
              render={({ field }) => (
                <Input
                  inputMode="decimal"
                  placeholder="60,00"
                  aria-label="Pedido mínimo em reais"
                  value={field.value}
                  className={styles.minOrderInput}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange(maskMoney(event.target.value))
                  }
                />
              )}
            />
          </FormField>
        </Box>
      </Card>
    </Box>
  )
}
