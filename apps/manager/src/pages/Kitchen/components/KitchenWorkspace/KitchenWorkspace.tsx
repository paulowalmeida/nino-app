import { useState } from 'react'

import { KitchenBoard } from '@pages/Kitchen/components/KitchenBoard/KitchenBoard'
import { KitchenHeader } from '@pages/Kitchen/components/KitchenHeader/KitchenHeader'

export const KitchenWorkspace = () => {
  const [isCompact, setIsCompact] = useState(false)

  return (
    <>
      <KitchenHeader
        isCompact={isCompact}
        onToggleCompact={() => setIsCompact((current) => !current)}
      />
      <KitchenBoard isCompact={isCompact} />
    </>
  )
}
