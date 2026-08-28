import { useEffect, useMemo } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'

import local from './StorePreview.module.css'

export type StorePreviewProps = {
  storeName: string
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  logoUrl?: string | null
  bannerUrl?: string | null
  logoFile?: File
  bannerFile?: File
}

const useFilePreview = (file?: File) => {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file])

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  return url
}

export const StorePreview = ({
  storeName,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  logoUrl,
  bannerUrl,
  logoFile,
  bannerFile,
}: StorePreviewProps) => {
  const localLogoUrl = useFilePreview(logoFile)
  const localBannerUrl = useFilePreview(bannerFile)
  const shownLogoUrl = localLogoUrl ?? logoUrl
  const shownBannerUrl = localBannerUrl ?? bannerUrl
  const shownName = storeName.trim() || 'Nome da unidade'

  return (
    <Box
      as="section"
      className={local.preview}
      aria-label="Prévia da loja para o cliente"
      style={
        {
          '--preview-primary': primaryColor,
          '--preview-secondary': secondaryColor,
          '--preview-tertiary': tertiaryColor,
          '--preview-banner': shownBannerUrl
            ? `url("${shownBannerUrl}")`
            : 'none',
        } as React.CSSProperties
      }
    >
      <Box className={local.browserBar} aria-hidden="true">
        <span className={local.browserDot} />
        <span className={local.browserDot} />
        <span className={local.browserDot} />
        <span className={local.address}>sualoja.nino.app</span>
      </Box>

      <Box className={local.storefront}>
        <Box className={local.banner} />

        <Box className={local.identity}>
          <Box className={local.logoTile}>
            {shownLogoUrl ? (
              <img src={shownLogoUrl} alt="" className={local.logo} />
            ) : (
              <span className={local.logoFallback} aria-hidden="true">
                {shownName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </Box>
          <Box className={local.identityText}>
            <Text className={local.storeName}>{shownName}</Text>
            <Text className={local.status}>
              <span className={local.statusDot} /> Aberta · 30–45 min
            </Text>
          </Box>
        </Box>

        <Box className={local.search}>Buscar no cardápio</Box>

        <Box className={local.categories} aria-hidden="true">
          <span className={`${local.category} ${local.categoryActive}`}>
            Destaques
          </span>
          <span className={local.category}>Combos</span>
          <span className={local.category}>Bebidas</span>
        </Box>

        <Box className={local.menu}>
          <Text className={local.menuTitle}>Destaques</Text>
          <Box className={local.product}>
            <Box className={local.productCopy}>
              <Text className={local.productName}>Especial da casa</Text>
              <Text className={local.productDescription}>
                O favorito dos clientes, preparado na hora.
              </Text>
              <Text className={local.price}>R$ 29,90</Text>
            </Box>
            <Box className={local.productImage} aria-hidden="true">
              🍽️
              <span className={local.add}>+</span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
