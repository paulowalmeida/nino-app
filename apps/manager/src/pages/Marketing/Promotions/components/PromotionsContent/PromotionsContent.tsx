import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Label } from '@nino/ds/components/Label'
import { Select } from '@nino/ds/components/Select'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import type {
  Promotion,
  PromotionChannel,
  PromotionInput,
  PromotionTrigger,
  PromotionType,
} from '@shared/types/marketing/promotion'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { ProductCategoryOption } from '@shared/types/product/product-category-option'

import styles from './PromotionsContent.module.css'

type FormState = {
  name: string
  description: string
  type: PromotionType
  trigger: PromotionTrigger
  code: string
  value: string
  minOrderValue: string
  channels: PromotionChannel[]
  startsAt: string
  endsAt: string
  isActive: boolean
  productIds: string[]
  categoryIds: string[]
}

type PromotionsContentProps = {
  promotions: Promotion[]
  products: MenuItem[]
  categoryOptions: ProductCategoryOption[]
  isPending: boolean
  isSaving: boolean
  save: (variables: { id?: string; data: PromotionInput }) => void
}

const ALL_CHANNELS: PromotionChannel[] = [
  'DELIVERY',
  'PICKUP',
  'COUNTER',
  'TABLE_TAB',
]

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  type: 'PERCENTAGE_DISCOUNT',
  trigger: 'AUTOMATIC',
  code: '',
  value: '',
  minOrderValue: '',
  channels: ALL_CHANNELS,
  startsAt: '',
  endsAt: '',
  isActive: true,
  productIds: [],
  categoryIds: [],
}

const TYPE_OPTIONS = [
  { value: 'PERCENTAGE_DISCOUNT', label: 'Desconto percentual' },
  { value: 'FIXED_DISCOUNT', label: 'Desconto em reais' },
  { value: 'FREE_DELIVERY', label: 'Frete grátis' },
]

const TRIGGER_OPTIONS = [
  { value: 'AUTOMATIC', label: 'Automática' },
  { value: 'COUPON', label: 'Cupom' },
]

const CHANNEL_LABELS: Record<PromotionChannel, string> = {
  DELIVERY: 'Entrega',
  PICKUP: 'Retirada',
  COUNTER: 'Balcão',
  TABLE_TAB: 'Comanda',
}

const toForm = (promotion: Promotion): FormState => ({
  name: promotion.name,
  description: promotion.description ?? '',
  type: promotion.type,
  trigger: promotion.trigger,
  code: promotion.code ?? '',
  value: String(promotion.value),
  minOrderValue: promotion.minOrderValue ? String(promotion.minOrderValue) : '',
  channels: promotion.channels.length ? promotion.channels : ALL_CHANNELS,
  startsAt: promotion.startsAt?.slice(0, 16) ?? '',
  endsAt: promotion.endsAt?.slice(0, 16) ?? '',
  isActive: promotion.isActive,
  productIds: promotion.productIds,
  categoryIds: promotion.categoryIds,
})

const money = (value: string) => Number(value.replace(',', '.')) || 0

const summary = (
  form: FormState,
  categories: ProductCategoryOption[],
  products: MenuItem[]
) => {
  const benefit =
    form.type === 'FREE_DELIVERY'
      ? 'frete grátis'
      : form.type === 'PERCENTAGE_DISCOUNT'
        ? `${form.value || '0'}% de desconto`
        : `R$ ${form.value || '0'} de desconto`
  const scope =
    form.productIds.length || form.categoryIds.length
      ? `nos ${form.productIds.length ? `${form.productIds.length} produto(s)` : ''}${form.productIds.length && form.categoryIds.length ? ' e ' : ''}${form.categoryIds.length ? `${form.categoryIds.length} categoria(s)` : ''} selecionados`
      : 'no pedido inteiro'
  const trigger =
    form.trigger === 'COUPON'
      ? `com o cupom ${form.code || 'informado'}`
      : 'automaticamente'
  const minimum = form.minOrderValue
    ? ` em pedidos a partir de R$ ${form.minOrderValue}`
    : ''
  void categories
  void products
  return `Oferece ${benefit} ${scope}, ${trigger}${minimum}.`
}

export const PromotionsContent = ({
  promotions,
  products,
  categoryOptions,
  isPending,
  isSaving,
  save,
}: PromotionsContentProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string>()

  const update = (patch: Partial<FormState>) =>
    setForm((current) => ({ ...current, ...patch }))

  const toggle = (field: 'productIds' | 'categoryIds', id: string) => {
    update({
      [field]: form[field].includes(id)
        ? form[field].filter((current) => current !== id)
        : [...form[field], id],
    })
  }

  const submit = () => {
    if (!form.name.trim()) return
    save({
      id: editingId,
      data: {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        trigger: form.trigger,
        code:
          form.trigger === 'COUPON'
            ? form.code.trim().toUpperCase()
            : undefined,
        value: money(form.value),
        minOrderValue: money(form.minOrderValue),
        channels: form.channels,
        startsAt: form.startsAt
          ? new Date(form.startsAt).toISOString()
          : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
        isActive: form.isActive,
        productIds: form.productIds,
        categoryIds: form.categoryIds,
      },
    })
  }

  if (isPending) return <Skeleton className={styles.skeleton} />

  return (
    <Box className={styles.promotionsContentLayout}>
      <Card variant="flat" padding="lg" className={styles.editor}>
        <Box className={styles.sectionHeader}>
          <Heading level={2} size="xl">
            {editingId ? 'Editar promoção' : 'Nova promoção'}
          </Heading>
          <Text size="sm" color="subtle">
            Configure a regra e confira o resumo antes de salvar.
          </Text>
        </Box>

        <Box className={styles.formGrid}>
          <Box className={styles.fieldWide}>
            <Label htmlFor="promotion-name">
              <FieldHint
                label="Nome da promoção"
                hint="Um nome interno para reconhecer a regra."
              />
            </Label>
            <Input
              id="promotion-name"
              value={form.name}
              onChange={(event) => update({ name: event.target.value })}
            />
          </Box>
          <Box className={styles.fieldWide}>
            <Label htmlFor="promotion-description">
              <FieldHint
                label="Descrição"
                hint="Explique o benefício para quem administra a unidade."
              />
            </Label>
            <Input
              id="promotion-description"
              value={form.description}
              onChange={(event) => update({ description: event.target.value })}
            />
          </Box>
          <Box className={styles.promotionsContentField}>
            <Label>
              <FieldHint
                label="Benefício"
                hint="Escolha o que será aplicado ao pedido."
              />
            </Label>
            <Select
              options={TYPE_OPTIONS}
              value={form.type}
              onValueChange={(value) =>
                update({ type: value as PromotionType })
              }
            />
          </Box>
          <Box className={styles.promotionsContentField}>
            <Label>
              <FieldHint
                label="Aplicação"
                hint="Automática ou liberada por cupom."
              />
            </Label>
            <Select
              options={TRIGGER_OPTIONS}
              value={form.trigger}
              onValueChange={(value) =>
                update({ trigger: value as PromotionTrigger })
              }
            />
          </Box>
          {form.type !== 'FREE_DELIVERY' && (
            <Box className={styles.promotionsContentField}>
              <Label htmlFor="promotion-value">
                <FieldHint
                  label={
                    form.type === 'PERCENTAGE_DISCOUNT'
                      ? 'Percentual (%)'
                      : 'Valor (R$)'
                  }
                  hint="O desconto não pode ultrapassar o subtotal elegível."
                />
              </Label>
              <Input
                id="promotion-value"
                inputMode="decimal"
                value={form.value}
                onChange={(event) => update({ value: event.target.value })}
              />
            </Box>
          )}
          {form.trigger === 'COUPON' && (
            <Box className={styles.promotionsContentField}>
              <Label htmlFor="promotion-code">
                <FieldHint
                  label="Código do cupom"
                  hint="O cliente informa este código no checkout."
                />
              </Label>
              <Input
                id="promotion-code"
                value={form.code}
                onChange={(event) =>
                  update({ code: event.target.value.toUpperCase() })
                }
              />
            </Box>
          )}
          <Box className={styles.promotionsContentField}>
            <Label htmlFor="promotion-minimum">
              <FieldHint
                label="Pedido mínimo (R$)"
                hint="Deixe vazio para não exigir valor mínimo."
              />
            </Label>
            <Input
              id="promotion-minimum"
              inputMode="decimal"
              value={form.minOrderValue}
              onChange={(event) =>
                update({ minOrderValue: event.target.value })
              }
            />
          </Box>
          <Box className={styles.promotionsContentField}>
            <Label htmlFor="promotion-start">
              <FieldHint label="Começa em" hint="Opcional." />
            </Label>
            <Input
              id="promotion-start"
              type="datetime-local"
              value={form.startsAt}
              onChange={(event) => update({ startsAt: event.target.value })}
            />
          </Box>
          <Box className={styles.promotionsContentField}>
            <Label htmlFor="promotion-end">
              <FieldHint label="Termina em" hint="Opcional." />
            </Label>
            <Input
              id="promotion-end"
              type="datetime-local"
              value={form.endsAt}
              onChange={(event) => update({ endsAt: event.target.value })}
            />
          </Box>
        </Box>

        <Box className={styles.promotionsContentGroup}>
          <Text weight="semibold">Canais</Text>
          <Box className={styles.checkGrid}>
            {ALL_CHANNELS.map((channel) => (
              <Box key={channel} className={styles.checkItem}>
                <Checkbox
                  checked={form.channels.includes(channel)}
                  onCheckedChange={() =>
                    update({
                      channels: form.channels.includes(channel)
                        ? form.channels.filter((item) => item !== channel)
                        : [...form.channels, channel],
                    })
                  }
                />
                <Text as="span" size="sm">
                  {CHANNEL_LABELS[channel]}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className={styles.promotionsContentGroup}>
          <Text weight="semibold">Aplicar a produtos ou categorias</Text>
          <Text size="xs" color="subtle">
            Sem seleção, a promoção vale para o pedido inteiro.
          </Text>
          <Box className={styles.checkGrid}>
            {categoryOptions.map((category) => (
              <Box key={category.value} className={styles.checkItem}>
                <Checkbox
                  checked={form.categoryIds.includes(category.value)}
                  onCheckedChange={() => toggle('categoryIds', category.value)}
                />
                <Text as="span" size="sm">
                  Categoria: {category.label}
                </Text>
              </Box>
            ))}
            {products.map((product) => (
              <Box key={product.id} className={styles.checkItem}>
                <Checkbox
                  checked={form.productIds.includes(product.id)}
                  onCheckedChange={() => toggle('productIds', product.id)}
                />
                <Text as="span" size="sm">
                  Produto: {product.name}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className={styles.switchRow}>
          <Switch
            checked={form.isActive}
            onCheckedChange={(isActive) => update({ isActive })}
            aria-label="Promoção ativa"
          />
          <Text>Promoção ativa</Text>
        </Box>

        <Box className={styles.promotionsContentSummary}>
          <Text size="xs" color="subtle">
            Resumo da regra
          </Text>
          <Text>{summary(form, categoryOptions, products)}</Text>
        </Box>

        <Box direction="row" gap={2}>
          <Button
            loading={isSaving}
            disabled={!form.name.trim()}
            onClick={submit}
          >
            Salvar promoção
          </Button>
          {editingId && (
            <Button
              variant="ghost"
              onClick={() => {
                setEditingId(undefined)
                setForm(EMPTY_FORM)
              }}
            >
              Cancelar edição
            </Button>
          )}
        </Box>
      </Card>

      <Card variant="flat" padding="lg" className={styles.promotionsContentList}>
        <Box className={styles.sectionHeader}>
          <Heading level={2} size="xl">
            Promoções cadastradas
          </Heading>
          <Text size="sm" color="subtle">
            Edite uma regra existente para reaproveitar sua configuração.
          </Text>
        </Box>
        {promotions.length === 0 ? (
          <EmptyState>Ainda não há promoções nesta unidade.</EmptyState>
        ) : (
          promotions.map((promotion) => (
            <Box key={promotion.id} className={styles.promotionRow}>
              <Box>
                <Text weight="semibold">{promotion.name}</Text>
                <Text size="sm" color="subtle">
                  {promotion.trigger === 'COUPON'
                    ? `Cupom ${promotion.code}`
                    : 'Automática'}{' '}
                  ·{' '}
                  {promotion.type === 'FREE_DELIVERY'
                    ? 'Frete grátis'
                    : promotion.type === 'PERCENTAGE_DISCOUNT'
                      ? `${promotion.value}%`
                      : `R$ ${promotion.value}`}
                </Text>
              </Box>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingId(promotion.id)
                  setForm(toForm(promotion))
                }}
              >
                Editar
              </Button>
            </Box>
          ))
        )}
      </Card>
    </Box>
  )
}
