import { useState } from 'react'

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
import { campaignDefaultName } from '@pages/PromotionEditor/utils/campaignDefaultName/campaignDefaultName'
import { maskMoney, moneyValue } from '@shared/utils/money/money'

import styles from './BenefitSection.module.css'

const TYPE_HINTS = {
  'free-delivery': 'Zera a entrega se a condição for cumprida.',
  discount: 'Desconta dos itens; frete normal.',
  gift: 'O brinde custa R$ 0 no pedido.',
  package: 'Só permite os itens e opções liberados.',
} as const

export const BenefitSection = () => {
  const { mode, giftProductOptions } = usePromotionEditorFacade()
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<PromotionFormValues>()
  const campaignType = useWatch({ control, name: 'campaignType' })
  const discountKind = useWatch({ control, name: 'discountKind' })
  const isDiscount = campaignType === 'discount'
  const isPackage = campaignType === 'package'
  const isPercentage = discountKind === 'PERCENTAGE_DISCOUNT'
  /* WHY: o nome sugerido acompanha o tipo só até o gestor digitar o dele. */
  const [isNameEdited, setNameEdited] = useState(mode !== 'create')
  const campaignTypeField = (
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
            onValueChange={(type) => {
              field.onChange(type)
              if (!isNameEdited) {
                setValue(
                  'name',
                  campaignDefaultName(
                    type as PromotionFormValues['campaignType'],
                    new Date()
                  )
                )
              }
            }}
          />
        )}
      />
    </FormField>
  )
  const discountValueField = isDiscount ? (
    <FormField
      label={isPercentage ? 'Desconto (%)' : 'Desconto (R$)'}
      error={errors.discountValue?.message}
      className={styles.discountValueField}
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
            placeholder={isPercentage ? 'Ex.: 10' : 'Ex.: 10,00'}
            aria-label={
              isPercentage ? 'Desconto em percentual' : 'Desconto em reais'
            }
            value={field.value}
            error={!!errors.discountValue}
            className={styles.amountInput}
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
  ) : null
  const minOrderField = (
    <FormField
      label="Pedido mínimo"
      helperText="Só conta o valor dos itens."
      className={isDiscount ? styles.discountAuxField : styles.amountField}
    >
      <Controller
        name="minOrderValue"
        control={control}
        render={({ field }) => (
          <Input
            inputMode="decimal"
            placeholder="Sem mínimo"
            aria-label="Pedido mínimo em reais"
            value={field.value}
            className={styles.minOrderInput}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(maskMoney(event.target.value))}
          />
        )}
      />
    </FormField>
  )

  return (
    <Box as="section" aria-labelledby="campaign-benefit">
      <Card variant="flat" padding="lg" className={styles.benefitSection}>
        <Heading level={2} size="sm" id="campaign-benefit">
          Benefício
        </Heading>

        <FormField
          label="Nome da campanha"
          helperText={
            isPackage
              ? 'O cliente vê este nome no card da promoção.'
              : 'Só você vê; ajuda a achar a campanha na lista.'
          }
          error={errors.name?.message}
          className={styles.nameField}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              maxLength: { value: 120, message: 'Use até 120 caracteres' },
            }}
            render={({ field }) => (
              <Input
                placeholder={
                  isPackage
                    ? 'Ex.: Combo burger + refri'
                    : 'Ex.: Frete de sexta'
                }
                value={field.value}
                error={!!errors.name}
                onBlur={field.onBlur}
                onChange={(event) => {
                  setNameEdited(true)
                  field.onChange(event.target.value)
                }}
              />
            )}
          />
        </FormField>

        <Box direction="row" className={styles.benefitFields}>
          {isDiscount ? (
            <Box direction="column" className={styles.discountMainFields}>
              {campaignTypeField}
              <FormField
                label="Como desconta"
                className={styles.discountKindField}
              >
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
            </Box>
          ) : (
            campaignTypeField
          )}

          {campaignType === 'gift' && (
            <FormField
              label="Produto de brinde"
              helperText="Produtos ativos, sem opções obrigatórias."
              error={errors.giftProductId?.message}
              className={styles.giftProductField}
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
            <Box
              direction={{ mobile: 'column', tablet: 'row' }}
              className={styles.discountAuxFields}
            >
              {discountValueField}
              {isPercentage && (
                <FormField
                  label="Teto do desconto"
                  helperText="Opcional: limite o desconto em reais."
                  className={styles.discountAuxField}
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
                        className={styles.amountInput}
                        onBlur={field.onBlur}
                        onChange={(event) =>
                          field.onChange(maskMoney(event.target.value))
                        }
                      />
                    )}
                  />
                </FormField>
              )}
              {minOrderField}
            </Box>
          )}

          {isPackage && (
            <FormField
              label="Preço fechado"
              helperText="A soma dos itens aparece riscada."
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
                    placeholder="Ex.: 49,90"
                    aria-label="Preço fechado da promoção"
                    value={field.value}
                    error={!!errors.packagePrice}
                    className={styles.amountInput}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(maskMoney(event.target.value))
                    }
                  />
                )}
              />
            </FormField>
          )}

          {!isDiscount && minOrderField}
        </Box>
      </Card>
    </Box>
  )
}
