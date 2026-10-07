import { type CSSProperties, useEffect, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { Chip } from '@nino/ds/components/Chip'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { DEFAULT_CATALOG_DRAFT } from '@pages/Units/constants/catalog.constants'
import { DEFAULT_HOME_DRAFT } from '@pages/Units/constants/home.constants'
import type { BrandColors } from '@pages/Units/types/BrandColors.type'
import type { CatalogDraft } from '@pages/Units/types/CatalogDraft.type'
import type { HomeDraft } from '@pages/Units/types/HomeDraft.type'
import type { PreviewDevice } from '@pages/Units/types/PreviewDevice.type'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

import motion from '@styles/motion.module.css'
import local from './StorefrontPreview.module.css'

export type StorefrontPreviewProps = {
  storeName: string
  colors: BrandColors
  device: PreviewDevice
  logoUrl?: string | null
  bannerUrl?: string | null
  logoFile?: File
  bannerFile?: File
  catalog?: CatalogDraft
  home?: HomeDraft
}

type PreviewProduct = {
  id: string
  name: string
  description: string
  price: string
  image: string
}

const PREVIEW_PRODUCTS: PreviewProduct[] = [
  {
    id: 'special',
    name: 'Especial da casa',
    description: 'O favorito dos clientes, preparado na hora.',
    price: 'R$ 29,90',
    image: '/product-presets/x-salada.png',
  },
  {
    id: 'combo',
    name: 'Combo do dia',
    description: 'Prato, acompanhamento e bebida.',
    price: 'R$ 42,00',
    image: '/product-presets/combo-x-salada-batata-refri.png',
  },
  {
    id: 'bacon',
    name: 'X-Bacon',
    description: 'Hambúrguer, bacon crocante, queijo e molho da casa.',
    price: 'R$ 28,90',
    image: '/product-presets/x-bacon.png',
  },
  {
    id: 'egg',
    name: 'X-Egg',
    description: 'Hambúrguer, ovo, queijo, alface e tomate.',
    price: 'R$ 26,50',
    image: '/product-presets/x-egg.png',
  },
]

const PREVIEW_CATEGORIES = [
  { name: 'Destaques', icon: '⭐' },
  { name: 'Combos', icon: '🍟' },
  { name: 'Bebidas', icon: '🥤' },
]

type PreviewProductCardProps = {
  product: PreviewProduct
  catalog: CatalogDraft
}

const PreviewProductCard = ({ product, catalog }: PreviewProductCardProps) => (
  <Card
    padding="sm"
    className={local.productCard}
    data-item-style={catalog.itemStyle}
    data-density={catalog.density}
    data-image-ratio={catalog.imageRatio}
    role="group"
  >
    <Button variant="ghost" className={local.productOpen}>
      <Box className={local.productMedia}>
        <Image
          src={resolveApiAssetUrl(product.image)}
          alt=""
          className={local.productPhoto}
          wrapperClassName={local.productPhoto}
          placeholder={<Box className={local.noPhoto} aria-hidden="true" />}
        />
      </Box>
      <Box className={local.productBody}>
        <Heading level={3} className={local.productName}>
          {product.name}
        </Heading>
        {catalog.showDescription && (
          <Text as="p" className={local.productDescription}>
            {product.description}
          </Text>
        )}
        <Text as="span" className={local.productPrice}>
          {product.price}
        </Text>
      </Box>
    </Button>
    <Button
      variant="primary"
      size="icon"
      className={local.productAdd}
      aria-label={`Adicionar ${product.name}`}
    >
      <Icon name="plus" />
    </Button>
  </Card>
)

const useFilePreview = (file?: File) => {
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    if (!file) {
      setUrl(undefined)
      return
    }

    const nextUrl = URL.createObjectURL(file)
    setUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [file])

  return url
}

export const StorefrontPreview = ({
  storeName,
  colors,
  device,
  logoUrl,
  bannerUrl,
  logoFile,
  bannerFile,
  catalog = DEFAULT_CATALOG_DRAFT,
  home = DEFAULT_HOME_DRAFT,
}: StorefrontPreviewProps) => {
  const localLogoUrl = useFilePreview(logoFile)
  const localBannerUrl = useFilePreview(bannerFile)
  const shownLogoUrl = localLogoUrl ?? logoUrl
  const shownBannerUrl = localBannerUrl ?? bannerUrl
  const shownName = storeName.trim() || 'Nome da unidade'
  const visibleProducts =
    device === 'desktop' ? PREVIEW_PRODUCTS : PREVIEW_PRODUCTS.slice(0, 2)

  return (
    <Box className={local.dock}>
      <Box
        direction="row"
        align="center"
        justify="between"
        gap={3}
        className={local.dockBar}
      >
        <Text size="xs" weight="bold" className={local.dockTitle}>
          O que o cliente vê
        </Text>
      </Box>

      <Box
        className={`${local.frame} ${local[device]}`}
        style={
          {
            '--preview-primary': colors.primaryColor,
            '--preview-secondary': colors.secondaryColor,
            '--preview-tertiary': colors.tertiaryColor,
            '--preview-background': colors.backgroundColor,
            '--preview-text': colors.textColor,
            '--preview-card': colors.cardColor,
            '--preview-border': colors.borderColor,
            '--preview-muted': colors.mutedTextColor,
          } as CSSProperties
        }
      >
        {device === 'desktop' && (
          <Box as="header" direction="row" className={local.storeHeader}>
            <a
              className={local.storeBrand}
              href="#"
              onClick={(event) => event.preventDefault()}
            >
              <Box className={local.headerLogo} aria-hidden="true">
                {shownLogoUrl ? (
                  <img
                    src={shownLogoUrl}
                    alt=""
                    className={local.headerLogoImage}
                  />
                ) : (
                  <Text as="span" className={local.headerLogoFallback}>
                    {shownName.slice(0, 2).toUpperCase()}
                  </Text>
                )}
              </Box>
              <Text as="span" className={local.headerStoreName}>
                {shownName}
              </Text>
            </a>

            <Box direction="row" className={local.headerSearch}>
              <Icon name="search" className={local.headerSearchIcon} />
              <Text as="span" className={local.headerSearchText}>
                Buscar no cardápio
              </Text>
            </Box>

            <Box direction="row" className={local.headerTools}>
              <Text as="span" className={local.headerStatus}>
                <span className={local.headerStatusDot} aria-hidden="true" />
                Aberto agora
              </Text>
              <Button
                variant="ghost"
                size="icon"
                className={local.headerIcon}
                aria-label="Informações da loja"
              >
                <Icon name="info" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={local.headerIcon}
                aria-label="Notificações"
              >
                <Icon name="bell" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={local.headerIcon}
                aria-label="Sacola"
              >
                <Icon name="shopping-cart" />
              </Button>
              <Button
                variant="primary"
                size="icon"
                className={local.headerAccount}
                aria-label="Sua conta"
              >
                <Icon name="user" />
              </Button>
            </Box>
          </Box>
        )}

        <Box
          as="section"
          key={device}
          aria-label="Prévia da loja para o cliente"
          className={`${local.storefront} ${motion.settle}`}
        >
          {home.showBanner && (
            <Box
              className={`${local.storefrontPreviewBanner} ${shownBannerUrl ? local.customBanner : ''}`}
            >
              {shownBannerUrl && (
                <img
                  src={shownBannerUrl}
                  alt=""
                  className={local.customImage}
                />
              )}
              {!shownBannerUrl &&
                (shownLogoUrl ? (
                  <img src={shownLogoUrl} alt="" className={local.bannerMark} />
                ) : (
                  <Text
                    as="span"
                    className={local.bannerMonogram}
                    aria-hidden="true"
                  >
                    {shownName.slice(0, 2).toUpperCase()}
                  </Text>
                ))}
            </Box>
          )}

          <Box
            direction="row"
            className={`${local.identityRow} ${
              shownBannerUrl ? local.afterCustomBanner : ''
            }`}
          >
            <Box className={local.logoTile} aria-hidden="true">
              {shownLogoUrl ? (
                <img src={shownLogoUrl} alt="" className={local.storefrontPreviewLogo} />
              ) : (
                <Text as="span" className={local.logoFallback}>
                  {shownName.slice(0, 2).toUpperCase()}
                </Text>
              )}
            </Box>
            <Box className={local.identityText}>
              <Heading level={1} className={local.storeName}>
                {shownName}
              </Heading>
              <Box direction="row" className={local.statusLine}>
                <Text as="span" className={local.storefrontPreviewStatus}>
                  <span className={local.statusDot} aria-hidden="true" />
                  Aberto agora
                </Text>
                <Text as="span" className={local.estimatedTime}>
                  ~25 min
                </Text>
                <Button variant="ghost" size="sm" className={local.more}>
                  Detalhes da loja
                </Button>
              </Box>
            </Box>
          </Box>

          {home.showSearch && (
            <Box className={local.storefrontPreviewSearch}>
              <Icon name="search" className={local.searchIcon} />
              <Input
                type="search"
                aria-label="Buscar no cardápio"
                placeholder="Buscar no cardápio"
                className={local.searchInput}
                readOnly
                tabIndex={-1}
              />
            </Box>
          )}

          {home.showCategoryBar && (
            <Box
              as="nav"
              className={local.categories}
              aria-label="Categorias do cardápio"
            >
              <Box direction="row" className={local.categoryTrack}>
                {PREVIEW_CATEGORIES.map(({ name, icon }, index) => (
                  <Chip
                    key={name}
                    variant="toggle"
                    selected={index === 0}
                    borderless
                    className={local.category}
                    leadingIcon={<span aria-hidden="true">{icon}</span>}
                    onClick={() => undefined}
                  >
                    {name}
                  </Chip>
                ))}
              </Box>
            </Box>
          )}

          <Box className={local.storefrontPreviewMenu}>
            <Box direction="row" className={local.sectionHead}>
              <Heading level={2} className={local.menuTitle}>
                Destaques
              </Heading>
              <Text as="span" className={local.sectionCount}>
                {visibleProducts.length} opções
              </Text>
            </Box>
            <Box className={local.products}>
              {visibleProducts.map((product) => (
                <PreviewProductCard
                  key={product.id}
                  product={product}
                  catalog={catalog}
                />
              ))}
            </Box>
          </Box>

          {device === 'mobile' && (
            <Box
              as="nav"
              direction="row"
              className={local.tabBar}
              aria-label="Atalhos"
            >
              <Button variant="ghost" className={local.storefrontPreviewTab}>
                <Text as="span" className={local.tabIcon}>
                  <Icon name="bag" />
                  <Text as="span" className={local.tabBadge}>
                    2
                  </Text>
                </Text>
                <Text as="span" className={local.tabLabel}>
                  Sacola
                </Text>
              </Button>
              <Button
                variant="ghost"
                className={`${local.storefrontPreviewTab} ${local.homeTab}`}
              >
                <Text as="span" className={local.homeRing}>
                  <Icon name="home" />
                </Text>
                <Text as="span" className={local.tabLabel}>
                  Início
                </Text>
              </Button>
              <Button variant="ghost" className={local.storefrontPreviewTab}>
                <Icon name="bell" />
                <Text as="span" className={local.tabLabel}>
                  Notificações
                </Text>
              </Button>
              <Button variant="ghost" className={local.storefrontPreviewTab}>
                <Icon name="user" />
                <Text as="span" className={local.tabLabel}>
                  Perfil
                </Text>
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
