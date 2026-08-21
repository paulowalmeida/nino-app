import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'

import { riseDelay } from '@utils/rise-delay'

import motion from '@styles/rise.module.css'

type RiseInProps = {
  /** Milissegundos de atraso na entrada, para escalonar os blocos da tela. */
  delay?: number
  as?: 'div' | 'header' | 'section'
  className?: string
  children: ReactNode
}


export const RiseIn = ({
  delay = 0,
  as = 'div',
  className,
  children,
}: RiseInProps) => (
  <Box
    as={as}
    direction="column"
    className={className ? `${motion.rise} ${className}` : motion.rise}
    style={riseDelay(delay)}
  >
    {children}
  </Box>
)
