/** O documento de tema da loja, como a API o guarda e devolve. */
export type ThemeConfig = {
  brand: {
    logoUrl: string | null
    faviconUrl: string | null
    bannerUrl: string | null
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
    type: 'MASCOT' | 'SPINNER' | 'DOTS'
  }
  catalog?: {
    itemStyle: 'side-image' | 'big-image' | 'condensed' | 'text-only'
    imageRatio: '1:1' | '4:3' | '16:9'
    density: 'compact' | 'comfortable'
    showDescription: boolean
  }
  tracking?: {
    stageLabels: Partial<
      Record<
        | 'PENDING'
        | 'ACCEPTED'
        | 'PREPARING'
        | 'OUT_FOR_DELIVERY'
        | 'READY_FOR_PICKUP'
        | 'DELIVERED'
        | 'COMPLETED',
        string | null
      >
    >
    waitingMessage: string | null
  }
}
