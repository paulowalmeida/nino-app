import { useCallback } from 'react'

import { useIsDesktop } from '@pages/Counter/hooks/useIsDesktop/useIsDesktop'
import { useCounterStore } from '@pages/Counter/states/counter/counter.store'

export const useCounterResponsive = () => {
  const setSheet = useCounterStore((state) => state.setSheet)
  const isDesktop = useIsDesktop(
    useCallback(
      (nextIsDesktop: boolean) => {
        if (nextIsDesktop) setSheet(false)
      },
      [setSheet]
    )
  )

  return { isDesktop }
}
