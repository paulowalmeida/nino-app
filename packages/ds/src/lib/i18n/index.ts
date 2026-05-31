import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUI from '../../locales/en/ui.json'
import ptBRUI from '../../locales/pt-BR/ui.json'

export const defaultNS = 'ui'

export const resources = {
  en: { ui: enUI },
  'pt-BR': { ui: ptBRUI },
} as const

// Initializes i18n for the @nino/ds lib with bundled translations.
// Apps can call i18n.addResourceBundle() to add their own namespaces
// or override existing keys.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    defaultNS,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
}

export { i18n }
