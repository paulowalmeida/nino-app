export type PersonMarkTone = 'brand' | 'quiet'

export type PersonMarkProps = {
  name: string
  /** `quiet` para quem não opera o painel, como o entregador. */
  tone?: PersonMarkTone
  className?: string
}
