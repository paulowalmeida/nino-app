import { Fragment, useEffect, useState } from 'react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
import {
  type PackageProductOrder,
  usePackageProducts,
} from '@pages/PromotionEditor/hooks/usePackageProducts/usePackageProducts'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { useDebouncedValue } from '@shared/hooks/ui/useDebouncedValue/useDebouncedValue'
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

type PackageProductListProps = {
  unitId: string | null
  getKind: () => PromotionFormValues['packageGroups'][number]['kind']
  value: PackageProduct[]
  onChange: (products: PackageProduct[]) => void
}

const PackageProductList = ({
  unitId,
  getKind,
  value,
  onChange,
}: PackageProductListProps) => {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<PackageProductOrder['sortBy']>('name')
  const [direction, setDirection] =
    useState<PackageProductOrder['direction']>('asc')
  const search = useDebouncedValue(query.trim())
  const products = usePackageProducts(unitId, {
    page,
    size: pageSize,
    search,
    sortBy,
    direction,
  })
  const total = products.data?.pagination.total ?? 0
  const items = products.data?.data ?? []
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  return (
    <Box className={styles.productPicker}>
      <Box className={styles.productTools}>
        <FormField
          label="Pesquisar produtos"
          className={styles.productSearchField}
        >
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
        <FormField label="Itens por página" className={styles.pageSizeField}>
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
        {total} produto{total === 1 ? '' : 's'} · {value.length} selecionado
        {value.length === 1 ? '' : 's'}
      </Text>

      <Table className={styles.productTable}>
        <TableHeader>
          <TableRow>
            <TableHead
              aria-sort={
                sortBy === 'name'
                  ? direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => {
                  setDirection(
                    sortBy === 'name' && direction === 'asc' ? 'desc' : 'asc'
                  )
                  setSortBy('name')
                  setPage(1)
                }}
              >
                Produto{' '}
                {sortBy === 'name' ? (direction === 'asc' ? '↑' : '↓') : ''}
              </button>
            </TableHead>
            <TableHead
              aria-sort={
                sortBy === 'category'
                  ? direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => {
                  setDirection(
                    sortBy === 'category' && direction === 'asc'
                      ? 'desc'
                      : 'asc'
                  )
                  setSortBy('category')
                  setPage(1)
                }}
              >
                Categoria{' '}
                {sortBy === 'category' ? (direction === 'asc' ? '↑' : '↓') : ''}
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const selected = value.find(
              ({ productId }) => productId === item.id
            )
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
              <Fragment key={item.id}>
                <TableRow className={styles.productRow}>
                  <TableCell>
                    <label className={styles.checkRow}>
                      <Checkbox
                        checked={!!selected}
                        onCheckedChange={(checked) =>
                          toggleProduct(checked === true)
                        }
                      />
                      <span>{item.name}</span>
                    </label>
                  </TableCell>
                  <TableCell className={styles.productCategory}>
                    {item.category.name}
                  </TableCell>
                </TableRow>
                {selected && options.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Box className={styles.options}>
                        <Text className={styles.optionsLabel}>
                          Opções de composição aceitas
                        </Text>
                        {options.map((option) => (
                          <label key={option.id} className={styles.optionRow}>
                            <Checkbox
                              size="sm"
                              checked={selected.allowedOptionIds.includes(
                                option.id
                              )}
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
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            )
          })}
          {products.isPending && (
            <TableRow>
              <TableCell colSpan={2}>
                <Text className={styles.emptyProducts}>
                  Carregando produtos…
                </Text>
              </TableCell>
            </TableRow>
          )}
          {products.isError && (
            <TableRow>
              <TableCell colSpan={2}>
                <Text className={styles.errorText}>
                  Não foi possível carregar os produtos.
                </Text>
              </TableCell>
            </TableRow>
          )}
          {!products.isPending && !products.isError && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={2}>
                <Text className={styles.emptyProducts}>
                  Nenhum produto encontrado.
                </Text>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {total > pageSize && (
        <Pagination
          className={styles.pagination}
          count={total}
          pageSize={pageSize}
          page={page}
          onPageChange={setPage}
        />
      )}
    </Box>
  )
}

export const PackageSection = () => {
  const { unitId } = usePromotionEditorFacade()
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
                  <FormField label="Montagem" className={styles.groupKindField}>
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

                  <FormField
                    label="Quantidade"
                    className={styles.groupQuantityField}
                  >
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
                        unitId={unitId}
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
