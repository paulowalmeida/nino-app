import type { ReactNode } from 'react'

import { Flexbox } from '@nino/ds/components/Flexbox'

import { riseDelay } from '@utils/rise-delay'

import motion from '@styles/rise.module.css'

type RiseInProps = {
  /** Milissegundos de atraso na entrada, para escalonar os blocos da tela. */
  delay?: number
  as?: 'div' | 'header' | 'section'
  className?: string
  children: ReactNode
}

/**
 * Bloco que sobe ao entrar na tela.
 *
 * O gesto é sempre o mesmo — a peça sobe alguns pixels enquanto aparece — e o
 * que muda de uma para a outra é só o atraso, que escalona a entrada de cima
 * para baixo. Sem isto, cada tela repete o par `motion.rise` + `riseDelay` em
 * volta de cada campo.
 *
 * @param delay - Atraso da entrada, em ms. Default: `0`
 *
 * @example
 * <RiseIn delay={120}>
 *   <FormField label="Email">...</FormField>
 * </RiseIn>
 */
export const RiseIn = ({
  delay = 0,
  as = 'div',
  className,
  children,
}: RiseInProps) => (
  <Flexbox
    as={as}
    direction="column"
    className={className ? `${motion.rise} ${className}` : motion.rise}
    style={riseDelay(delay)}
  >
    {children}
  </Flexbox>
)
