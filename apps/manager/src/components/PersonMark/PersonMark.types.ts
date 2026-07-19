export type PersonMarkTone = 'brand' | 'quiet' | 'night'

export type PersonMarkSize = 'sm' | 'md'

export type PersonMarkProps = {
  name: string
  /** `quiet` para quem não opera o painel; `night` sobre fundo escuro. */
  tone?: PersonMarkTone
  size?: PersonMarkSize
  className?: string
}
