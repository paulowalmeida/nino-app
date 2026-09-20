import { type CSSProperties, useEffect, useMemo } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { BrandColors } from '@pages/Units/types/BrandColors.type'
import type { PreviewDevice } from '@pages/Units/types/PreviewDevice.type'

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
}

const useFilePreview = (file?: File) => {
  const url = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file]
  )

  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url)
    },
    [url]
  )

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
}: StorefrontPreviewProps) => {
  const localLogoUrl = useFilePreview(logoFile)
  const localBannerUrl = useFilePreview(bannerFile)
  const shownLogoUrl = localLogoUrl ?? logoUrl
  const shownBannerUrl = localBannerUrl ?? bannerUrl
  const shownName = storeName.trim() || 'Nome da unidade'

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
            '--preview-banner': shownBannerUrl
              ? `url("${shownBannerUrl}")`
              : 'none',
          } as CSSProperties
        }
      >
        <Box className={local.chrome} aria-hidden="true">
          <Box className={local.chromeDots}>
            <Box className={local.chromeDot} />
            <Box className={local.chromeDot} />
            <Box className={local.chromeDot} />
          </Box>
          <Text as="span" className={local.chromeAddress}>
            sualoja.nino.delivery
          </Text>
          <Box className={local.chromeNotch} />
        </Box>

        <Box
          as="section"
          key={device}
          aria-label="Prévia da loja para o cliente"
          className={`${local.storefront} ${motion.settle}`}
        >
          <Box className={local.banner} />

          <Box className={local.identity}>
            <Box className={local.logoTile}>
              {shownLogoUrl ? (
                <img src={shownLogoUrl} alt="" className={local.logo} />
              ) : (
                <Text as="span" className={local.logoFallback}>
                  {shownName.slice(0, 2).toUpperCase()}
                </Text>
              )}
            </Box>
            <Box className={local.identityText}>
              <Text className={local.storeName}>{shownName}</Text>
              <Text className={local.status}>
                <Text as="span" className={local.statusDot} />
                Aberta agora · 30–45 min
              </Text>
            </Box>
          </Box>

          <Text className={local.search}>Buscar no cardápio</Text>

          <Box className={local.categories} aria-hidden="true">
            <Text as="span" className={`${local.category} ${local.current}`}>
              Destaques
            </Text>
            <Text as="span" className={local.category}>
              Combos
            </Text>
            <Text as="span" className={local.category}>
              Bebidas
            </Text>
          </Box>

          <Box className={local.menu}>
            <Text className={local.menuTitle}>Destaques</Text>
            <Box className={local.products}>
              <Box className={local.product}>
                <Box className={local.productCopy}>
                  <Text className={local.productName}>Especial da casa</Text>
                  <Text className={local.productNote}>
                    O favorito dos clientes, preparado na hora.
                  </Text>
                  <Text className={local.price}>R$ 29,90</Text>
                </Box>
                <Box className={local.productImage} aria-hidden="true">
                  <Icon name="chef-hat" size="lg" />
                  <Text as="span" className={local.add}>
                    <Icon name="plus" size="sm" />
                  </Text>
                </Box>
              </Box>
              <Box className={local.product}>
                <Box className={local.productCopy}>
                  <Text className={local.productName}>Combo do dia</Text>
                  <Text className={local.productNote}>
                    Prato, acompanhamento e bebida.
                  </Text>
                  <Text className={local.price}>R$ 42,00</Text>
                </Box>
                <Box className={local.productImage} aria-hidden="true">
                  <Icon name="shopping-bag" size="lg" />
                  <Text as="span" className={local.add}>
                    <Icon name="plus" size="sm" />
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className={local.cartBar} aria-hidden="true">
            <Text as="span">Ver sacola · 2 itens</Text>
            <Text as="span" className={local.cartTotal}>
              R$ 71,90
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
