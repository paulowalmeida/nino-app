import { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Pagination } from '@nino/ds/components/Pagination'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import type { MenuItem } from '@shared/types/product/menu-item'

import styles from './PackageSection.module.css'

const GROUP_KIND_OPTIONS = [
  { value: 'FIXED', label: 'Fixo' },
  { value: 'CHOICE', label: 'À escolha' },
]

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100].map((size) => ({
  value: String(size),
  label: String(size),
}))

type PackageProduct =
  PromotionFormValues['packageGroups'][number]['products'][number]

const compositionOptions = (item: MenuItem) =>
  (item.modifiers ?? [])
    .filter(({ role }) => role === 'COMPOSITION')
    .flatMap(({ options }) => options)

const acceptsPackage = (item: MenuItem) =>
  item.isActive &&
  !(item.modifiers ?? []).some(
    ({ role, minSelections }) => role === 'ADDITION' && minSelections > 0
  )

type PackageProductListProps = {
  items: MenuItem[]
  getKind: () => PromotionFormValues['packageGroups'][number]['kind']
  value: PackageProduct[]
  onChange: (products: PackageProduct[]) => void
}

const PackageProductList = ({
  items,
  getKind,
  value,
  onChange,
}: PackageProductListProps) => {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    if (!normalizedQuery) return items
    return items.filter((item) =>
      item.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
    )
  }, [items, query])
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const visibleItems = filteredItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  return (
    <Box className={styles.productPicker}>
      <Box className={styles.productTools}>
        <FormField label="Pesquisar produtos">
          <Input
            type="search"
            value={query}
            placeholder="Nome do produto"
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
          />
        </FormField>
        <FormField label="Itens por página">
          <Select
            options={PAGE_SIZE_OPTIONS}
            value={String(pageSize)}
            onValueChange={(size) => {
              setPageSize(Number(size))
              setPage(1)
            }}
          />
        </FormField>
      </Box>

      <Text className={styles.resultCount}>
        {filteredItems.length} produto{filteredItems.length === 1 ? '' : 's'} ·{' '}
        {value.length} selecionado{value.length === 1 ? '' : 's'}
      </Text>

      <Box className={styles.productList}>
        {visibleItems.map((item) => {
          const selected = value.find(({ productId }) => productId === item.id)
          const options = compositionOptions(item)
          const toggleProduct = (checked: boolean) => {
            if (!checked) {
              onChange(value.filter(({ productId }) => productId !== item.id))
              return
            }
            const product = {
              productId: item.id,
              allowedOptionIds: options.map(({ id }) => id),
            }
            onChange(getKind() === 'FIXED' ? [product] : [...value, product])
          }

          return (
            <Box key={item.id} className={styles.product}>
              <label className={styles.checkRow}>
                <Checkbox
                  checked={!!selected}
                  onCheckedChange={(checked) => toggleProduct(checked === true)}
                />
                <span>{item.name}</span>
              </label>
              {selected && options.length > 0 && (
                <Box className={styles.options}>
                  <Text className={styles.optionsLabel}>
                    Opções de composição aceitas
                  </Text>
                  {options.map((option) => (
                    <label key={option.id} className={styles.optionRow}>
                      <Checkbox
                        size="sm"
                        checked={selected.allowedOptionIds.includes(option.id)}
                        onCheckedChange={(checked) => {
                          onChange(
                            value.map((product) =>
                              product.productId !== item.id
                                ? product
                                : {
                                    ...product,
                                    allowedOptionIds:
                                      checked === true
                                        ? [
                                            ...product.allowedOptionIds,
                                            option.id,
                                          ]
                                        : product.allowedOptionIds.filter(
                                            (id) => id !== option.id
                                          ),
                                  }
                            )
                          )
                        }}
                      />
                      <span>{option.name}</span>
                    </label>
                  ))}
                </Box>
              )}
            </Box>
          )
        })}
        {visibleItems.length === 0 && (
          <Text className={styles.emptyProducts}>
            Nenhum produto encontrado.
          </Text>
        )}
      </Box>

      {filteredItems.length > pageSize && (
        <Pagination
          className={styles.pagination}
          count={filteredItems.length}
          pageSize={pageSize}
          page={page}
          onPageChange={setPage}
        />
      )}
    </Box>
  )
}

export const PackageSection = () => {
  const { menuItems } = usePromotionEditorFacade()
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<PromotionFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'packageGroups',
  })
  const availableItems = menuItems.filter(acceptsPackage)

  return (
    <Box as="section" aria-labelledby="package-composition">
      <Card variant="flat" padding="lg" className={styles.packageSection}>
        <Box direction="row" className={styles.headingRow}>
          <Box>
            <Heading level={2} size="sm" id="package-composition">
              Composição da promoção
            </Heading>
            <Text className={styles.sectionHint}>
              O preço das opções liberadas é ignorado no pacote.
            </Text>
          </Box>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                kind: 'CHOICE',
                quantity: 1,
                allowRepeatedProducts: false,
                products: [],
              })
            }
          >
            Adicionar grupo
          </Button>
        </Box>

        {fields.length === 0 && (
          <Text className={styles.emptyGroups}>
            Adicione ao menos um grupo para montar a promoção.
          </Text>
        )}

        <Box className={styles.groups}>
          {fields.map((group, groupIndex) => {
            const productsName = `packageGroups.${groupIndex}.products` as const
            const kindName = `packageGroups.${groupIndex}.kind` as const
            const quantityName = `packageGroups.${groupIndex}.quantity` as const
            const repeatName =
              `packageGroups.${groupIndex}.allowRepeatedProducts` as const
            return (
              <Box key={group.id} className={styles.group}>
                <Box direction="row" className={styles.groupHeader}>
                  <Heading level={3} size="sm">
                    Grupo {groupIndex + 1}
                  </Heading>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(groupIndex)}
                  >
                    Remover
                  </Button>
                </Box>

                <Box className={styles.groupSettings}>
                  <FormField label="Montagem">
                    <Controller
                      name={kindName}
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={GROUP_KIND_OPTIONS}
                          value={field.value}
                          onValueChange={(kind) => {
                            field.onChange(kind)
                            if (kind === 'FIXED') {
                              const selected = getValues(productsName)
                              if (selected.length > 1) {
                                setValue(productsName, selected.slice(0, 1), {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                })
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </FormField>

                  <FormField label="Quantidade">
                    <Controller
                      name={quantityName}
                      control={control}
                      rules={{
                        min: { value: 1, message: 'Use ao menos 1' },
                        max: { value: 20, message: 'Use no máximo 20' },
                        validate: (quantity) => {
                          const current = getValues(
                            `packageGroups.${groupIndex}`
                          )
                          return (
                            current.allowRepeatedProducts ||
                            quantity <= current.products.length ||
                            'Libere mais produtos ou permita repetição'
                          )
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                        />
                      )}
                    />
                  </FormField>
                </Box>

                <Controller
                  name={repeatName}
                  control={control}
                  render={({ field }) => (
                    <label className={styles.checkRow}>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      <span>Permitir repetir o mesmo produto</span>
                    </label>
                  )}
                />

                <Controller
                  name={productsName}
                  control={control}
                  rules={{
                    validate: (products) =>
                      products.length > 0 || 'Libere ao menos um produto',
                  }}
                  render={({ field }) => (
                    <Box className={styles.products}>
                      <Text className={styles.productsLabel}>
                        Produtos liberados
                      </Text>
                      <PackageProductList
                        items={availableItems}
                        getKind={() => getValues(kindName)}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {errors.packageGroups?.[groupIndex]?.products
                        ?.message && (
                        <Text className={styles.errorText}>
                          {errors.packageGroups[groupIndex]?.products?.message}
                        </Text>
                      )}
                    </Box>
                  )}
                />
              </Box>
            )
          })}
        </Box>
      </Card>
    </Box>
  )
}
