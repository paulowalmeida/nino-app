import { DEFAULT_HOME_DRAFT } from '@pages/Units/constants/home.constants'
import type { HomeDraft } from '@pages/Units/types/HomeDraft.type'
import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'

/** O documento vira os interruptores da home, tudo ligado por padrão. */
export const toHomeDraft = (config: ThemeConfig): HomeDraft =>
  config.home ?? DEFAULT_HOME_DRAFT
