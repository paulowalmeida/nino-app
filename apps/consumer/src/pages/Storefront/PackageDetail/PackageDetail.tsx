import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { Text } from '@nino/ds/components/Text'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { ProductDetailShell } from '@pages/Storefront/ProductDetail/components/ProductDetailShell/ProductDetailShell'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { resolveApiAssetUrl } from '@utils/api-asset-url/api-asset-url'
import { brl } from '@utils/money'
import { resolveBackHref } from '@utils/resolve-back-href'

import styles from './PackageDetail.module.css'

type PackagePromotion = PublicPromotion & {
  packageGroups: NonNullable<PublicPromotion['packageGroups']>
}
type PackageProduct =
  PackagePromotion['packageGroups'][number]['products'][number]
type SelectedProduct = { productId: string; optionIds: string[] }
type PackageSelection = Record<string, SelectedProduct[]>

const optionsByModifier = (product: PackageProduct) =>
  Object.values(
    product.allowedOptions.reduce<
      Record<
        string,
        {
          id: string
          name: string
          minSelections: number
          maxSelections: number
          options: PackageProduct['allowedOptions']
        }
      >
    >((groups, option) => {
      groups[option.modifierId] ??= {
        id: option.modifierId,
        name: option.modifierName,
        minSelections: option.minSelections,
        maxSelections: option.maxSelections,
        options: [],
      }
      groups[option.modifierId].options.push(option)
      return groups
    }, {})
  )

const defaultOptions = (product: PackageProduct) =>
  optionsByModifier(product).flatMap((modifier) =>
    modifier.minSelections > 0
      ? modifier.options.slice(0, modifier.minSelections).map(({ id }) => id)
      : []
  )

const initialSelection = (promotion: PackagePromotion): PackageSelection =>
  Object.fromEntries(
    promotion.packageGroups.map((group) => {
      const product = group.kind === 'FIXED' ? group.products[0] : undefined
      return [
        group.id,
        product
          ? Array.from({ length: group.quantity }, () => ({
              productId: product.id,
              optionIds: defaultOptions(product),
            }))
          : [],
      ]
    })
  )

const productOf = (
  promotion: PackagePromotion,
  productId: string
): PackageProduct | undefined =>
  promotion.packageGroups
    .flatMap(({ products }) => products)
    .find(({ id }) => id === productId)

const selectionIsComplete = (
  promotion: PackagePromotion,
  selection: PackageSelection
) =>
  promotion.packageGroups.every((group) => {
    const entries = selection[group.id] ?? []
    if (entries.length !== group.quantity) return false
    return entries.every((entry) => {
      const product = group.products.find(({ id }) => id === entry.productId)
      if (!product?.isAvailable) return false
      return optionsByModifier(product).every((modifier) => {
        const count = modifier.options.filter(({ id }) =>
          entry.optionIds.includes(id)
        ).length
        return (
          count >= modifier.minSelections && count <= modifier.maxSelections
        )
      })
    })
  })

export const PackageDetail = () => {
  const { slug, promotionId } = useParams()
  const navigate = useNavigate()
  const home = useStorefrontFacade()
  const promotion = home.packageOffers.find(({ id }) => id === promotionId)
  const [selection, setSelection] = useState<PackageSelection>({})
  const [groupIndex, setGroupIndex] = useState(0)

  useEffect(() => {
    if (promotion) setSelection(initialSelection(promotion))
  }, [promotion])

  const close = () => void navigate(resolveBackHref(slug))
  const group = promotion?.packageGroups[groupIndex]
  const selected = group ? (selection[group.id] ?? []) : []
  const isComplete = promotion
    ? selectionIsComplete(promotion, selection)
    : false
  const listPrice = useMemo(() => {
    if (!promotion) return 0
    return promotion.packageGroups.reduce(
      (total, packageGroup) =>
        total +
        (selection[packageGroup.id] ?? []).reduce((groupTotal, entry) => {
          const product = packageGroup.products.find(
            ({ id }) => id === entry.productId
          )
          if (!product) return groupTotal
          const optionTotal = product.allowedOptions
            .filter(({ id }) => entry.optionIds.includes(id))
            .reduce((sum, { price }) => sum + price, 0)
          return groupTotal + product.price + optionTotal
        }, 0),
      0
    )
  }, [promotion, selection])

  if (!promotion || !group) {
    return (
      <ProductDetailShell
        isDesktop={home.isDesktop}
        ariaLabel="Promoção indisponível"
        onClose={close}
        media={null}
        details={
          <Box className={styles.unavailable}>
            <Heading level={2} size="md">
              Promoção indisponível
            </Heading>
            <Text>Ela pode ter terminado ou algum item saiu do cardápio.</Text>
          </Box>
        }
      />
    )
  }

  const updateEntry = (
    entryIndex: number,
    update: (entry: SelectedProduct) => SelectedProduct
  ) =>
    setSelection((current) => ({
      ...current,
      [group.id]: current[group.id].map((entry, index) =>
        index === entryIndex ? update(entry) : entry
      ),
    }))

  const addProduct = (product: PackageProduct) => {
    if (selected.length >= group.quantity) return
    if (
      !group.allowRepeatedProducts &&
      selected.some(({ productId: id }) => id === product.id)
    )
      return
    setSelection((current) => ({
      ...current,
      [group.id]: [
        ...(current[group.id] ?? []),
        { productId: product.id, optionIds: defaultOptions(product) },
      ],
    }))
  }

  const removeProduct = (entryIndex: number) =>
    setSelection((current) => ({
      ...current,
      [group.id]: current[group.id].filter((_, index) => index !== entryIndex),
    }))

  const addToCart = () => {
    if (!isComplete) return
    const groups = promotion.packageGroups.map((packageGroup) => ({
      groupId: packageGroup.id,
      items: selection[packageGroup.id].map((entry) => {
        const product = productOf(promotion, entry.productId) as PackageProduct
        return {
          productId: product.id,
          quantity: 1,
          unitPrice: product.price,
          modifiers: entry.optionIds.map((optionId) => ({
            optionId,
            quantity: 1,
          })),
        }
      }),
    }))
    home.addPackageToCart({
      id: `package:${promotion.id}`,
      name: promotion.name,
      price: String(promotion.value),
      imageUrl: resolveApiAssetUrl(promotion.imageUrl),
      modifiers: promotion.packageGroups.flatMap((packageGroup) =>
        selection[packageGroup.id].map((entry) => {
          const product = productOf(
            promotion,
            entry.productId
          ) as PackageProduct
          return {
            optionId: `${packageGroup.id}:${entry.productId}`,
            name: product.name,
            price: '0',
            quantity: 1,
          }
        })
      ),
      package: { promotionId: promotion.id, groups, listPrice },
    })
    close()
    home.setCartOpen(true)
  }

  const currentComplete = selected.length === group.quantity
  const isLast = groupIndex === promotion.packageGroups.length - 1

  return (
    <ProductDetailShell
      isDesktop={home.isDesktop}
      ariaLabel={promotion.name}
      onClose={close}
      media={null}
      details={
        <Box className={styles.builder}>
          <Box className={styles.offerHeader}>
            <Text className={styles.offerTitle}>{promotion.name}</Text>
            <Text className={styles.offerSubtitle}>
              Monte seu pacote e economize
            </Text>
            <Box direction="row" className={styles.offerPrices}>
              <Text className={styles.offerPrice}>{brl(promotion.value)}</Text>
              {listPrice > promotion.value && (
                <s className={styles.offerListPrice}>{brl(listPrice)}</s>
              )}
            </Box>
          </Box>

          <Box direction="row" className={styles.builderHeading}>
            <Heading level={2} size="md">
              Monte sua comanda
            </Heading>
            <Text>
              {groupIndex + 1} de {promotion.packageGroups.length}
            </Text>
          </Box>

          <Box className={styles.steps}>
            {promotion.packageGroups.map((stepGroup, index) => (
              <Button
                key={stepGroup.id}
                type="button"
                variant="ghost"
                className={`${styles.step} ${
                  index === groupIndex ? styles.activeStep : ''
                }`}
                onClick={() => setGroupIndex(index)}
              >
                {index + 1} ·{' '}
                {stepGroup.kind === 'FIXED' ? 'Fixos' : 'Escolhas'}
              </Button>
            ))}
          </Box>

          <Box direction="row" className={styles.groupHeading}>
            <Box>
              <Heading level={3} size="sm">
                {group.kind === 'FIXED'
                  ? `${group.quantity} item fixo`
                  : `Escolha ${group.quantity} ${
                      group.quantity === 1 ? 'item' : 'itens'
                    }`}
              </Heading>
              <Text className={styles.selectionCount}>
                {selected.length} de {group.quantity} selecionados
              </Text>
            </Box>
          </Box>

          <Box className={styles.products}>
            {group.products
              .filter(({ isAvailable }) => isAvailable)
              .map((product) => {
                const count = selected.filter(
                  ({ productId: id }) => id === product.id
                ).length
                const canAdd =
                  selected.length < group.quantity &&
                  (group.allowRepeatedProducts || count === 0)
                return (
                  <Box key={product.id} className={styles.productRow}>
                    <Image
                      src={resolveApiAssetUrl(product.imageUrl)}
                      alt=""
                      className={styles.productImage}
                      wrapperClassName={styles.productImageWrap}
                    />
                    <Box className={styles.productCopy}>
                      <Text className={styles.productName}>{product.name}</Text>
                      <Text className={styles.included}>Incluído</Text>
                    </Box>
                    {group.kind === 'CHOICE' && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className={styles.addButton}
                        disabled={!canAdd}
                        aria-label={`Adicionar ${product.name}`}
                        onClick={() => addProduct(product)}
                      >
                        <Icon name="plus" />
                      </Button>
                    )}
                  </Box>
                )
              })}
          </Box>

          <Box className={styles.selectedOptions}>
            {selected.map((entry, entryIndex) => {
              const product = group.products.find(
                ({ id }) => id === entry.productId
              ) as PackageProduct
              const modifiers = optionsByModifier(product)
              return (
                <Box
                  key={`${entry.productId}-${entryIndex}`}
                  className={styles.selectedItem}
                >
                  <Box direction="row" className={styles.selectedHeader}>
                    <Text className={styles.selectedName}>{product.name}</Text>
                    {group.kind === 'CHOICE' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(entryIndex)}
                      >
                        Remover
                      </Button>
                    )}
                  </Box>
                  {modifiers.map((modifier) => (
                    <Box key={modifier.id} className={styles.modifier}>
                      <Text className={styles.modifierName}>
                        {modifier.name}
                      </Text>
                      {modifier.options.map((option) => (
                        <label key={option.id} className={styles.option}>
                          <Checkbox
                            size="sm"
                            checked={entry.optionIds.includes(option.id)}
                            onCheckedChange={(checked) =>
                              updateEntry(entryIndex, (current) => {
                                const withoutGroup = current.optionIds.filter(
                                  (id) =>
                                    !modifier.options.some(
                                      ({ id: optionId }) => optionId === id
                                    )
                                )
                                const next =
                                  checked === true
                                    ? modifier.maxSelections === 1
                                      ? [...withoutGroup, option.id]
                                      : [...current.optionIds, option.id]
                                    : current.optionIds.filter(
                                        (id) => id !== option.id
                                      )
                                return { ...current, optionIds: next }
                              })
                            }
                          />
                          <span>{option.name}</span>
                        </label>
                      ))}
                    </Box>
                  ))}
                </Box>
              )
            })}
          </Box>
        </Box>
      }
      footer={
        <Box direction="row" className={styles.footer}>
          <Box>
            <Text className={styles.footerLabel}>Pacote fechado</Text>
            <Text className={styles.footerPrice}>{brl(promotion.value)}</Text>
          </Box>
          <Button
            className={styles.continueButton}
            disabled={isLast ? !isComplete : !currentComplete}
            onClick={() =>
              isLast ? addToCart() : setGroupIndex((index) => index + 1)
            }
          >
            {isLast ? 'Adicionar promoção' : 'Continuar'}
            <Icon name="arrow-right" />
          </Button>
        </Box>
      }
    />
  )
}
