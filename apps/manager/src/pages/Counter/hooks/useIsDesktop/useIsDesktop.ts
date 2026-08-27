import { useEffect, useState } from 'react'

const QUERY = '(min-width: 1024px)'

export const useIsDesktop = (
  onChange?: (isDesktop: boolean) => void
): boolean => {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(QUERY).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onMediaChange = () => {
      const nextIsDesktop = mql.matches
      setIsDesktop(nextIsDesktop)
      onChange?.(nextIsDesktop)
    }

    mql.addEventListener('change', onMediaChange)
    return () => mql.removeEventListener('change', onMediaChange)
  }, [onChange])

  return isDesktop
}
