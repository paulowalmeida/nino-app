import type { BrandColors } from '@pages/Units/types/BrandColors.type'
import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'

/**
 * O documento publicado vira o rascunho que os controles editam.
 *
 * Campo nulo no tema significa "essa loja nunca escolheu essa cor": devolve
 * string vazia para o controle cair no valor padrão do nino em vez de pintar
 * de preto.
 */
export const toThemeColors = (
  config: ThemeConfig
): BrandColors & { loadingType: ThemeConfig['loading']['type'] } => ({
  primaryColor: config.colors.primary ?? '',
  secondaryColor: config.colors.secondary ?? '',
  tertiaryColor: config.colors.tertiary ?? '',
  backgroundColor: config.colors.background ?? '',
  textColor: config.colors.text ?? '',
  cardColor: config.colors.surface ?? '',
  borderColor: config.colors.border ?? '',
  mutedTextColor: config.colors.mutedText ?? '',
  loadingType: config.loading.type,
})
