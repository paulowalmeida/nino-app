import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'

import { useStore } from '@hooks/useStore/useStore'
import {
  storeThemePrimaryColor,
  storeThemeVariables,
} from '@utils/store-theme/store-theme'
import { resolveSlug } from '@utils/resolve-slug'

export const useStoreTheme = (): string | undefined => {
  const { slug: pathSlug } = useParams()
  const { store } = useStore(resolveSlug(pathSlug) ?? undefined)
  const variables = useMemo(() => storeThemeVariables(store), [store])

  useEffect(() => {
    const root = document.documentElement
    const previous = new Map(
      Object.keys(variables).map((name) => [
        name,
        {
          value: root.style.getPropertyValue(name),
          priority: root.style.getPropertyPriority(name),
        },
      ])
    )

    for (const [name, variable] of Object.entries(variables)) {
      root.style.setProperty(name, variable)
    }

    return () => {
      for (const [name, state] of previous) {
        if (state.value)
          root.style.setProperty(name, state.value, state.priority)
        else root.style.removeProperty(name)
      }
    }
  }, [variables])

  return storeThemePrimaryColor(store)
}
