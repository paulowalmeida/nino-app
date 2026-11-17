/** O tema publicado da loja, como `GET /units/slug/:slug` o entrega. */
export type BannerCrop = {
  x: number
  y: number
  width: number
  height: number
}

export type BannerCrops = Partial<
  Record<
    'phone320' | 'phone425' | 'tablet768' | 'desktop1024' | 'desktop1920',
    BannerCrop
  >
>

export type BannerVariants = Partial<
  Record<
    'phone320' | 'phone425' | 'tablet768' | 'desktop1024' | 'desktop1920',
    string
  >
>

export type StoreTheme = {
  version: number
  configVersion: number
  templateId: string
  templateVersion: number
  config: {
    brand: {
      logoUrl: string | null
      faviconUrl: string | null
      bannerUrl: string | null
      bannerCrops?: BannerCrops
      bannerVariants?: BannerVariants
    }
    colors: {
      primary: string | null
      secondary: string | null
      tertiary: string | null
      background: string | null
      surface: string | null
      text: string | null
      mutedText: string | null
      border: string | null
    }
    typography: {
      headingFont: string
      bodyFont: string
    }
    shape: {
      radius: 'square' | 'soft' | 'round'
      border: 'none' | 'line' | 'shadow'
    }
    loading: {
      type: string
    }
    home?: {
      showBanner: boolean
      showSearch: boolean
      showCategoryBar: boolean
      showStoreInfo: boolean
    }
    catalog?: {
      itemStyle: 'side-image' | 'big-image' | 'condensed' | 'text-only'
      imageRatio: '1:1' | '4:3' | '16:9'
      density: 'compact' | 'comfortable'
      showDescription: boolean
    }
    tracking?: {
      stageLabels: Partial<Record<string, string | null>>
      waitingMessage: string | null
    }
  }
}
