import { useEffect, useState } from 'react'

const MOBILE_QUERY = '(max-width: 425px)'

export const useProductConfigurationMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const onMediaChange = () => setIsMobile(mediaQuery.matches)

    mediaQuery.addEventListener('change', onMediaChange)
    return () => mediaQuery.removeEventListener('change', onMediaChange)
  }, [])

  return isMobile
}
